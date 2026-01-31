import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const Gatekeeper = ({ onSuccess }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const functions = getFunctions();
            const verifyAccessKey = httpsCallable(functions, 'verifyAccessKey');

            const result = await verifyAccessKey({ password });
            const { token } = result.data;

            const auth = getAuth();
            await signInWithCustomToken(auth, token);

            if (onSuccess) onSuccess();

        } catch (err) {
            console.error(err);
            setError(true);
            setTimeout(() => setError(false), 800); // Remove shake class duration
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Secure Chat Access</h1>
            <form onSubmit={handleLogin} className={error ? 'shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                <input
                    type="password"
                    placeholder="Enter Access Key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoFocus
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Enter'}
                </button>
            </form>
            {error && <p style={{ color: 'var(--error-color)', marginTop: '1rem' }}>Access Denied</p>}
        </div>
    );
};

export default Gatekeeper;
