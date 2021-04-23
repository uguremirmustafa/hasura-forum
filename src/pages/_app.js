import '../styles/app.css';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { AuthProvider } from '../context/auth';
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
