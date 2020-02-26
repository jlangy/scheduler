import "@testing-library/react/cleanup-after-each";
import "@testing-library/jest-dom/extend-expect";

process.env['REACT_APP_WEBSOCKET_URL'] = 'ws://localhost:8001';