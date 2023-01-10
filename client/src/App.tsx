import { Outlet, useLoaderData } from "react-router-dom";
import Navbar from "./components/Navbar";
import Breadcrumb from "./components/Breadcrumb";
import ScrollToTop from "./components/elements/ScrollToTop";
import { Container } from "react-bootstrap";
import { getCategories } from "./service/products";
import { AppProvider } from "./context/AppContext";

export async function loader({ request, params }: any) {
  const url = new URL(request.url);
  const categories = await getCategories();
  return { url, categories };
}

function App() {
  const { categories } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <AppProvider>
      <Container className="pb-4">
        <ScrollToTop />
        <Navbar categories={categories} className="mb-4" />
        <Breadcrumb />
        <Outlet />
      </Container>
    </AppProvider>
  );
}

export default App;
