import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import api from "../../api";

export default function UpdatePostRoute({ children, component }) {
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const loggedInUser = useSelector((state) => state.auth.userData);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                // Fetch post
                const postResponse = await api.get(`api/get_post/${id}/`);
                setPosts(postResponse.data);

                // Fetch users
                const usersResponse = await api.get('/api/get_users/');
                const userData = {};
                usersResponse.data.forEach(user => {
                    userData[user.id] = user.username;
                });
                setUsers(userData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [id]);

    if (!loggedInUser) {
        return <Navigate to="/login" />;
    }

    if (component === "create") {
        return children;
    }

    if (component === "update") {
        if (!posts || !users) return null;

        const postAuthorUsername = users[posts.author];
        return postAuthorUsername === loggedInUser.username
            ? children
            : <Navigate to="/" />;
    }

    return <Navigate to="/" />;
}

UpdatePostRoute.propTypes = {
    children: PropTypes.node.isRequired,
    component: PropTypes.oneOf(['create', 'update']).isRequired,
};