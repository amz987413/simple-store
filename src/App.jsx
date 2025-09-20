import React, { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import './app.css'

function toDkp(id) {
  return `id-${id}`;
}
function fromDkp(str) {
  const m = /^id-(\d+)$/.exec(str || "");
  return m ? Number(m[1]) : null;
}
function parseHash() {
  const hash = (window.location.hash || "").replace(/^#/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "product" && parts[1]) {
    return { page: "product", dkpId: parts[1] };
  }
  return { page: "list" };
}


const fetchSmartphones = async ({ queryKey }) => {
  const [_key, searchTerm] = queryKey;
  if (!searchTerm) {
    const r = await fetch("https://dummyjson.com/products/category/smartphones");
    if (!r.ok) throw new Error("خطا در بارگذاری داده‌ها");
    const data = await r.json();
    return data.products.slice(0, 6);
  }
  const r = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`);
  if (!r.ok) throw new Error("خطا در بارگذاری داده‌ها");
  const data = await r.json();
  
  return data.products
    .filter((p) => p.category === "smartphones")
    .slice(0, 6);
};

const fetchProductById = async (id) => {
  const r = await fetch(`https://dummyjson.com/products/${id}`);
  if (r.status === 404) throw new Error("محصول پیدا نشد");
  if (!r.ok) throw new Error("خطا در بارگذاری محصول");
  return r.json();
};


function ProductsView({ onOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["smartphones", debounced],
    queryFn: fetchSmartphones,
    staleTime: 60_000,
    keepPreviousData: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [products, debounced]);

  if (isLoading)
    return <div style={{ color: "#94a3b8", textAlign: "center" }}>در حال بارگذاری...</div>;
  if (isError)
    return <div style={{ color: "#e11d48", textAlign: "center" }}>{error.message}</div>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
      <div style={{ width: "100%", maxWidth: 1200, marginBottom: 16 }}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجو..."
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #334155",
              outline: "none",
              backgroundColor: "#0b1220",
              color: "#e5e7eb",
              boxShadow: "0 2px 8px rgba(255, 0, 0, 0.25)",
            }}
        />
      </div>

      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {currentProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => onOpen(p)}
            style={{
              border: "1px solid #1f2937",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
              backgroundColor: "#111827",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              cursor: "pointer",
              color: "#e5e7eb",
              transition: "transform 120ms ease, box-shadow 120ms ease",
              boxShadow: "0 2px 8px rgba(255, 0, 0, 0.25)",
            }}
          >
            <img src={p.thumbnail} alt={p.title} style={{ width: "100%", borderRadius: 10 }} />
            <h3 style={{ margin: "10px 0 6px", color: "#f8fafc" }}>{p.title}</h3>
            <p style={{ margin: "0 0 8px", color: "#cbd5e1" }}>{p.description}</p>
            <p style={{ fontWeight: "bold", color: "#a5b4fc" }}>${p.price}</p>
            <p style={{ color: "#94a3b8", fontSize: 12 }}></p>
            
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 10,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: totalPages || 1 }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              padding: "8px 16px",
              backgroundColor: (currentPage === index + 1 ? "#334155" : "#1f2937"),
              color: (currentPage === index + 1 ? "#e5e7eb" : "#94a3b8"),
              border: "1px solid #334155",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255, 0, 0, 0.25)",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}


function ProductDetails({ route, onClose }) {
  const id = fromDkp(route.dkpId);

  const {
    data: selectedProduct,
    isLoading: pLoading,
    isError: pIsError,
    error: pError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 20,
        backgroundColor: "#111827",
        borderRadius: 12,
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
        textAlign: "center",
        border: "1px solid #1f2937",
        color: "#e5e7eb",
      }}
    >
      {pLoading && <div style={{ color: "#94a3b8" }}>در حال بارگذاری...</div>}
      {pIsError && <div style={{ color: "#e11d48" }}>{pError.message}</div>}

      {selectedProduct && (
        <>
          <img
            src={selectedProduct.thumbnail}
            alt={selectedProduct.title}
            style={{ width: "100%", borderRadius: 10 }}
          />
          <h2 style={{ color: "#f8fafc" }}>{selectedProduct.title}</h2>
          <p style={{ color: "#cbd5e1" }}>{selectedProduct.description}</p>
          <p style={{ fontWeight: "bold", color: "#a5b4fc" }}>قیمت: ${selectedProduct.price}</p>
          <p>برند: <span style={{ color: "#e5e7eb" }}>{selectedProduct.brand}</span></p>
          <p>دسته‌بندی: <span style={{ color: "#e5e7eb" }}>{selectedProduct.category}</span></p>
          <p>امتیاز: <span style={{ color: "#e5e7eb" }}>{selectedProduct.rating}</span></p>
          <p>موجودی: <span style={{ color: "#e5e7eb" }}>{selectedProduct.stock}</span></p>
        </>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: 16,
          padding: "10px 20px",
          backgroundColor: "#111827",
          color: "#cbd5e1",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(255, 0, 0, 0.25)",
        }}
      >
        بازگشت به محصولات
      </button>
    </div>
  );
}

function AppInner() {
  const [route, setRoute] = useState(parseHash());
  

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const openProduct = (product) => {
    window.location.hash = `/product/${toDkp(product.id)}`;
  };

  const closeDetails = () => {
    window.location.hash = `/`;
  };

  const isDetails = route.page === "product";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#0f172a",
        minHeight: "100vh",
      }}
    >
      {isDetails ? (
        <div
          className="grid-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 20,
            maxWidth: 1200,
            width: "100%",
          }}
        >
          <ProductDetails route={route} onClose={closeDetails} />
        </div>
      ) : (
        <ProductsView onOpen={openProduct} />
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
