import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated && user) {
            const redirectPath = user.role === 'telecaller' ? '/leads' : '/dashboard';
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const response = await authAPI.login(credentials);
            dispatch(loginSuccess(response.data));
            toast.success('Login successful!');
        } catch (error) {
            dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                loading...
                {/* <CircularProgress /> */}
            </Box>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 4,
                    marginLeft: 50,
                    marginRight: -70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        CRM Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={credentials.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>

                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/register')}
                        >
                            Don't have an account? Register
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 