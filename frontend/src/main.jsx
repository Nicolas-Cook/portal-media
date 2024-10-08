import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Login from "./routes/login";
import ErrorPage from "./error-page";
import Movies from "./routes/movies";
import PrivateRoute from './routes/private';
import Home from "./routes/home";
import Layout from './components/Layout';
import Cuenta from "./routes/cuenta";
import Series from "./routes/series";
import MovieDetail from "./routes/movieDetail";
import SerieDetail from "./routes/serieDetail";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Favorites from "./routes/favorites";
import Search from "./routes/search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/private",
    element: (
      <PrivateRoute>
        <Layout/>
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <Home /> },
      { path: 'movies', element: <Movies /> },
      { path: 'movie/:id', element: <MovieDetail /> },
      { path: 'series', element: <Series />},
      { path: 'serie/:id', element: <SerieDetail />},
      { path: 'favoritas', element: <Favorites />},
      { path: 'buscar', element: <Search />},
      { path: 'cuenta', element: <Cuenta />},
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
