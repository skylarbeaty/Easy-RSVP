import "@app/globals.css";

export const metadata = {
  title: "RSEZ ~ Easy RSVP",
  description: "An easy to use, lightweight RSVP app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main"/>
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  );
}
