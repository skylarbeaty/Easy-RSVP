import "@styles/globals.css";
import AppWrapper from "@components/AppWrapper";
import Nav from "@components/Nav";

export const metadata = {
  title: "RSEZ ~ Easy RSVP",
  description: "An easy to use, lightweight RSVP app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>
          <main className="app">
              <Nav />
              <><br /></>
              <div className="app-inner">
                {children}
              </div>
          </main>
        </AppWrapper>
      </body>
    </html>
  );
}
