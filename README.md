# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## API Configuration

This application uses a centralized API configuration system. The API endpoints are configured in `src/config/api.js`.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GEOAPIFY_API_KEY=your_geoapify_api_key_here
VITE_APP_NAME=LUX SUV
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

### API Features

- **Centralized Configuration**: All API endpoints are defined in one place
- **Environment-based URLs**: API base URL can be configured via environment variables
- **Automatic Retry Logic**: Failed requests are automatically retried with exponential backoff
- **Request Timeout**: Configurable timeout for all API requests
- **Authentication Headers**: Automatic handling of authorization headers
- **Error Handling**: Consistent error handling across all API calls
- **Logging**: Comprehensive logging for debugging and monitoring

### Usage

The API configuration is automatically used by all API modules (`authApi.js`, `bookingApi.js`, `addressApi.js`). No additional setup is required.