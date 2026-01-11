import { createBrowserRouter } from "react-router";
import Home from "../Layout/Home";
import Homemain from "../Layout/Homemain";
import Categorynews from "../Layout/Categorynews";
import Authlayout from "../Layout/Authlayout";
import Login from "../Components/User/Login";
import Register from "../Components/User/Register";
import Newsdetails from "../Components/Newscard/Newsdetails";
import Privateroute from "../PrivateRoute/Privateroute";
import Loading from "../Layout/Loading";
import Forgetpasswor from "../Components/User/Forgetpasswor";
import { fetchAllArticles, fetchArticleById } from "../lib/queries";


const router = createBrowserRouter([
    {
        path: '/',
        Component: Home,
        children: [
            {
                path: "",
                element: <Homemain></Homemain>
            },
            {
                path: '/category/:id',
                element: <Categorynews></Categorynews>,
                loader: async () => {
                  try {
                    const articles = await fetchAllArticles();
                    return articles;
                  } catch (error) {
                    console.error('Failed to load articles:', error);
                    // Return empty array as fallback
                    return [];
                  }
                },
                // for optimization
                hydrateFallbackElement: <Loading></Loading>
            },

        ],

    },
    {
        path: '/auth',
        element: <Authlayout></Authlayout>,
        children: [
            {
                path: '/auth/login',
                element: <Login></Login>,

            },
            {
                path: '/auth/register',
                element: <Register></Register>
            },
            {
                path: '/auth/passwordreset',
                element: <Forgetpasswor></Forgetpasswor>
            }
        ]

    },
    {
        path: '/newsdetails/:id',
        element: <Privateroute> 
            <Newsdetails></Newsdetails> 
        </Privateroute>,
        loader: async ({ params }) => {
          try {
            const article = await fetchArticleById(params.id);
            // Return as array to match previous shape (component expects array?)
            // The Newsdetails component uses find on the array, but we can return a single object?
            // Actually the loader previously returned array of articles; component finds by id.
            // Let's keep the same shape: return array with the single article.
            return article ? [article] : [];
          } catch (error) {
            console.error('Failed to load article:', error);
            return [];
          }
        },
        // for optimization
        hydrateFallbackElement: <Loading></Loading>
    }
])
export default router;