import { Outlet, useLoaderData } from "react-router-dom";
import Navbar from "./components/Navbar";
import Breadcrumb from "./components/Breadcrumb";
import ScrollToTop from "./components/ScrollToTop";
import { Container } from "react-bootstrap";
import { getCategories } from "./service/products";
import { AppProvider } from "./context/AppContext";
import WaterMark from "./components/WaterMark";

export async function loader({ request, params }: any) {
  const url = new URL(request.url);
  const categories = await getCategories();
  return { url, categories };
}

function App() {
  const { categories } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <AppProvider>
      <Container id="root-container">
        <ScrollToTop />
        <Navbar categories={categories} className="mb-lg-5 mb-4" />
        <Breadcrumb />
        <Outlet />
        <WaterMark />
      </Container>
    </AppProvider>
  );
}

export default App;
