import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Join from './Join.tsx';

const router = createBrowserRouter([
    {
        path: '/chat',
        element: <App />,
    },
    {
        path: '/join',
        element: <Join />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
);
