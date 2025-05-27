import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <div className="background">
        {Array.from({ length: 42 }).map((_, i) => <span key={i}></span>)}
      </div>
      <Component {...pageProps} />
    </>
  );
} 