import TrackingNotification from './TrackingNotification';

const TrackingNotificationContainer = ({ notifications, onRemoveNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <TrackingNotification
          key={notification.id}
          isVisible={true}
          onClose={() => onRemoveNotification(notification.id)}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          autoClose={notification.autoClose}
          duration={notification.duration}
        />
      ))}
    </div>
  );
};

export default TrackingNotificationContainer;