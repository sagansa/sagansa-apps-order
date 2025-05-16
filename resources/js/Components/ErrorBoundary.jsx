import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 rounded-lg">
                    <h2 className="mb-2 text-lg font-semibold text-red-800">Terjadi Kesalahan</h2>
                    <p className="text-red-600">
                        Mohon maaf, terjadi kesalahan saat memuat komponen ini.
                        Silakan muat ulang halaman atau hubungi administrator jika masalah berlanjut.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
