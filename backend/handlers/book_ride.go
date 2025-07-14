package handlers

import (
	"fmt"
	"github.com/diagnosis/luxsuv-v4/internal/logger"
	"github.com/diagnosis/luxsuv-v4/internal/models"
	"github.com/diagnosis/luxsuv-v4/internal/repository"
	"github.com/diagnosis/luxsuv-v4/internal/validation"
	"github.com/labstack/echo/v4"
	"net/http"
	"strconv"
	"time"
)

type BookRideHandler struct {
	repo   repository.BookRideRepository
	logger *logger.Logger
}

func NewBookRideHandler(repo repository.BookRideRepository, logger *logger.Logger) *BookRideHandler {
	return &BookRideHandler{
		repo:   repo,
		logger: logger,
	}
}

// Create handles booking creation for both authenticated and guest users
func (h *BookRideHandler) Create(c echo.Context) error {
	br := &models.BookRide{}
	if err := c.Bind(br); err != nil {
		h.logger.Warn(fmt.Sprintf("Invalid request body: %s", err.Error()))
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "invalid request body",
			"message": "Please check your booking information and try again",
		})
	}

	// Check if user is authenticated
	userID, isAuthenticated := c.Get("user_id").(int64)
	userEmail, _ := c.Get("email").(string)
	userName, _ := c.Get("username").(string)

	// Enhanced validation with user context
	if err := h.validateBookingRequest(br, isAuthenticated, userEmail); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   err.Error(),
			"message": "Please correct the highlighted fields and try again",
		})
	}

	// Set user context if authenticated
	if isAuthenticated {
		br.UserID = &userID
		h.logger.Info(fmt.Sprintf("Authenticated user %d (%s) creating booking", userID, userEmail))
		
		// Auto-fill user information if not provided or if email matches
		if userEmail != "" && (br.Email == "" || br.Email == userEmail) {
			br.Email = userEmail
		}
		if userName != "" && br.YourName == "" {
			br.YourName = userName
		}
	} else {
		h.logger.Info(fmt.Sprintf("Guest user creating booking with email: %s", br.Email))
	}

	// Set default statuses
	br.BookStatus = models.BookStatusPending
	br.RideStatus = models.RideStatusPending

	// Add server-side timestamp for audit
	br.CreatedAt = time.Now().UTC()

	// Create the booking
	if err := h.repo.Create(c.Request().Context(), br); err != nil {
		h.logger.Err(fmt.Sprintf("Error creating book ride: %s", err.Error()))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "error creating booking",
			"message": "We're experiencing technical difficulties. Please try again in a few moments.",
		})
	}

	h.logger.Info(fmt.Sprintf("Booking created successfully: ID %d, User ID: %v, Email: %s", 
		br.ID, br.UserID, br.Email))

	// Return enhanced response
	response := map[string]interface{}{
		"id":      br.ID,
		"message": "Booking submitted successfully",
		"status":  br.BookStatus,
		"booking": br,
	}

	if !isAuthenticated {
		response["note"] = "Your booking has been submitted. You can manage it using your email address."
	}

	return c.JSON(http.StatusCreated, response)
}

// GetByEmail retrieves bookings by email with enhanced filtering
func (h *BookRideHandler) GetByEmail(c echo.Context) error {
	email := c.Param("email")
	if email == "" {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "email is required",
			"message": "Please provide an email address to search for bookings",
		})
	}

	if err := validation.ValidateEmail(email); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   err.Error(),
			"message": "Please provide a valid email address",
		})
	}

	// Check if requesting user is authenticated and owns the email
	userEmail, isAuthenticated := c.Get("email").(string)
	if isAuthenticated && userEmail != email {
		h.logger.Warn(fmt.Sprintf("User %s attempting to access bookings for %s", userEmail, email))
		// Allow admins to access any email
		isAdmin, _ := c.Get("is_admin").(bool)
		if !isAdmin {
			return c.JSON(http.StatusForbidden, map[string]interface{}{
				"error":   "access denied",
				"message": "You can only access your own bookings",
			})
		}
	}

	bookings, err := h.repo.GetByEmail(c.Request().Context(), email)
	if err != nil {
		h.logger.Err(fmt.Sprintf("Failed to get bookings by email %s: %s", email, err.Error()))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "error retrieving bookings",
			"message": "We're having trouble retrieving your bookings. Please try again.",
		})
	}

	if len(bookings) == 0 {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"bookings": []models.BookRide{},
			"count":    0,
			"message":  "No bookings found for this email address",
		})
	}

	h.logger.Info(fmt.Sprintf("Retrieved %d bookings for email %s", len(bookings), email))
	
	return c.JSON(http.StatusOK, map[string]interface{}{
		"bookings": bookings,
		"count":    len(bookings),
		"message":  fmt.Sprintf("Found %d booking(s)", len(bookings)),
	})
}

// Update handles booking updates with proper authorization
func (h *BookRideHandler) Update(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "invalid booking ID",
			"message": "Please provide a valid booking ID",
		})
	}

	// Get the existing booking first
	existingBooking, err := h.repo.GetByID(c.Request().Context(), id)
	if err != nil {
		h.logger.Err(fmt.Sprintf("Failed to get booking %d: %s", id, err.Error()))
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"error":   "booking not found",
			"message": "The requested booking could not be found",
		})
	}

	// Check authorization
	if !h.canModifyBooking(c, existingBooking) {
		return c.JSON(http.StatusForbidden, map[string]interface{}{
			"error":   "access denied",
			"message": "You don't have permission to modify this booking",
		})
	}

	// Bind the update data
	updateData := &models.BookRide{}
	if err := c.Bind(updateData); err != nil {
		h.logger.Warn(fmt.Sprintf("Invalid request body for update: %s", err.Error()))
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "invalid request body",
			"message": "Please check your booking information and try again",
		})
	}

	// Validate the update
	userEmail, _ := c.Get("email").(string)
	if err := h.validateBookingRequest(updateData, true, userEmail); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   err.Error(),
			"message": "Please correct the highlighted fields and try again",
		})
	}

	// Preserve certain fields that shouldn't be modified by users
	updateData.ID = id
	updateData.UserID = existingBooking.UserID
	updateData.DriverID = existingBooking.DriverID
	updateData.CreatedAt = existingBooking.CreatedAt
	updateData.UpdatedAt = time.Now().UTC()

	// Only allow status changes by drivers/admins
	role, _ := c.Get("role").(string)
	isAdmin, _ := c.Get("is_admin").(bool)
	if role != models.RoleDriver && !isAdmin {
		updateData.BookStatus = existingBooking.BookStatus
		updateData.RideStatus = existingBooking.RideStatus
	}

	if err := h.repo.Update(c.Request().Context(), updateData); err != nil {
		h.logger.Err(fmt.Sprintf("Failed to update booking %d: %s", id, err.Error()))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "error updating booking",
			"message": "We're having trouble updating your booking. Please try again.",
		})
	}

	h.logger.Info(fmt.Sprintf("Booking updated successfully: ID %d", id))
	
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Booking updated successfully",
		"booking": updateData,
	})
}

// Accept handles booking acceptance by drivers
func (h *BookRideHandler) Accept(c echo.Context) error {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "invalid booking ID",
			"message": "Please provide a valid booking ID",
		})
	}

	driverID, ok := c.Get("user_id").(int64)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"error":   "driver not authorized",
			"message": "Please sign in to accept bookings",
		})
	}

	// Role check
	role, ok := c.Get("role").(string)
	if !ok || role != models.RoleDriver {
		return c.JSON(http.StatusForbidden, map[string]interface{}{
			"error":   "access denied: driver role required",
			"message": "Only drivers can accept bookings",
		})
	}

	// Check if booking exists and is available
	booking, err := h.repo.GetByID(c.Request().Context(), id)
	if err != nil {
		h.logger.Err(fmt.Sprintf("Failed to get booking %d: %s", id, err.Error()))
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"error":   "booking not found",
			"message": "The requested booking could not be found",
		})
	}

	if booking.BookStatus != models.BookStatusPending {
		return c.JSON(http.StatusConflict, map[string]interface{}{
			"error":   "booking not available",
			"message": "This booking has already been accepted or is no longer available",
		})
	}

	if err := h.repo.Accept(c.Request().Context(), id, driverID); err != nil {
		h.logger.Err(fmt.Sprintf("Failed to accept booking %d: %s", id, err.Error()))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "error accepting booking",
			"message": "We're having trouble accepting this booking. Please try again.",
		})
	}

	h.logger.Info(fmt.Sprintf("Booking accepted successfully: ID %d by driver %d", id, driverID))
	
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Booking accepted successfully",
		"booking_id": id,
		"driver_id": driverID,
	})
}

// GetByUserID retrieves bookings for authenticated user
func (h *BookRideHandler) GetByUserID(c echo.Context) error {
	userID, ok := c.Get("user_id").(int64)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"error":   "user not authorized",
			"message": "Please sign in to view your bookings",
		})
	}

	bookings, err := h.repo.GetByUserID(c.Request().Context(), userID)
	if err != nil {
		h.logger.Err(fmt.Sprintf("Failed to get bookings by user id %d: %s", userID, err.Error()))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "error retrieving bookings",
			"message": "We're having trouble retrieving your bookings. Please try again.",
		})
	}

	h.logger.Info(fmt.Sprintf("Retrieved %d bookings for user id %d", len(bookings), userID))
	
	return c.JSON(http.StatusOK, map[string]interface{}{
		"bookings": bookings,
		"count":    len(bookings),
		"message":  fmt.Sprintf("Found %d booking(s)", len(bookings)),
	})
}

// GetAvailableBookings returns pending bookings for drivers
func (h *BookRideHandler) GetAvailableBookings(c echo.Context) error {
	// Verify driver role
	role, ok := c.Get("role").(string)
	if !ok || role != models.RoleDriver {
		return c.JSON(http.StatusForbidden, map[string]interface{}{
			"error":   "access denied: driver role required",
			"message": "Only drivers can view available bookings",
		})
	}

	bookings, err := h.repo.GetAvailableBookings(c.Request().Context())
	if err != nil {
		h.logger.Err(fmt.Sprintf("Failed to get available bookings: %s", err.Error()))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "error retrieving available bookings",
			"message": "We're having trouble retrieving available bookings. Please try again.",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"bookings": bookings,
		"count":    len(bookings),
		"message":  fmt.Sprintf("Found %d available booking(s)", len(bookings)),
	})
}

// Helper methods

func (h *BookRideHandler) validateBookingRequest(br *models.BookRide, isAuthenticated bool, userEmail string) error {
	// Basic validation
	if err := validation.ValidateBookRide(br); err != nil {
		return err
	}

	// Enhanced validation for authenticated users
	if isAuthenticated && userEmail != "" {
		if br.Email != "" && br.Email != userEmail {
			h.logger.Warn(fmt.Sprintf("Authenticated user %s trying to book with different email %s", userEmail, br.Email))
			return fmt.Errorf("email must match your account email")
		}
	}

	// Validate date is not in the past
	if err := h.validateBookingDate(br.Date, br.Time); err != nil {
		return err
	}

	return nil
}

func (h *BookRideHandler) validateBookingDate(dateStr, timeStr string) error {
	// Parse the date and time
	bookingTime, err := time.Parse("2006-01-02 15:04", dateStr+" "+timeStr)
	if err != nil {
		return fmt.Errorf("invalid date or time format")
	}

	// Check if booking is at least 1 hour in the future
	minBookingTime := time.Now().Add(1 * time.Hour)
	if bookingTime.Before(minBookingTime) {
		return fmt.Errorf("booking must be at least 1 hour in advance")
	}

	return nil
}

func (h *BookRideHandler) canModifyBooking(c echo.Context, booking *models.BookRide) bool {
	// Admin can modify any booking
	isAdmin, _ := c.Get("is_admin").(bool)
	if isAdmin {
		return true
	}

	// Driver can modify bookings they've accepted
	role, _ := c.Get("role").(string)
	userID, _ := c.Get("user_id").(int64)
	if role == models.RoleDriver && booking.DriverID != nil && *booking.DriverID == userID {
		return true
	}

	// User can modify their own bookings if not yet accepted
	if booking.UserID != nil && *booking.UserID == userID && booking.BookStatus == models.BookStatusPending {
		return true
	}

	// Guest users can modify using email (additional security could be added)
	userEmail, _ := c.Get("email").(string)
	if booking.UserID == nil && booking.Email == userEmail {
		return true
	}

	return false
}