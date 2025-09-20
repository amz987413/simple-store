import React, { useState, useEffect } from "react";

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

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [route, setRoute] = useState(parseHash());              
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pLoading, setPLoading] = useState(false);
  const [pError, setPError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;


  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  
  useEffect(() => {
    fetch("https://dummyjson.com/products/category/smartphones")
      .then((response) => {
        if (!response.ok) {
          throw new Error("خطا در بارگذاری داده‌ها");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.products.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "خطا در بارگذاری داده‌ها");
        setLoading(false);
      });
  }, []);

  
  useEffect(() => {
    if (route.page !== "product") {
      setSelectedProduct(null);
      setPError(null);
      return;
    }
    const id = fromDkp(route.dkpId);
    if (!id) {
      setPError("شناسه محصول نامعتبر است");
      setSelectedProduct(null);
      return;
    }

    
    const inList = products.find((x) => x.id === id);
    if (inList) {
      setSelectedProduct(inList);
      setPError(null);
      return;
    }

    
    setPLoading(true);
    setPError(null);
    fetch(`https://dummyjson.com/products/${id}`)
      .then((r) => {
        if (r.status === 404) throw new Error("محصول پیدا نشد");
        if (!r.ok) throw new Error("خطا در بارگذاری محصول");
        return r.json();
      })
      .then((data) => setSelectedProduct(data))
      .catch((e) => {
        setSelectedProduct(null);
        setPError(e.message || "خطا در بارگذاری محصول");
      })
      .finally(() => setPLoading(false));
  }, [route, products]);

  const openProduct = (product) => {
    
    window.location.hash = `/product/${toDkp(product.id)}`;

    setSelectedProduct(product);
  };

  const closeDetails = () => {
    window.location.hash = `/`;
    setSelectedProduct(null);
    setPError(null);
  };

  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  
  if (loading) return <div style={{ color: "#8f330fff", textAlign: "center" }}>در حال بارگذاری...</div>;
  if (error) return <div style={{ color: "#8f330fff", textAlign: "center" }}>{error}</div>;

  const isDetails = route.page === "product";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#487712ff",
        minHeight: "100vh",
      }}
    >
      <div
        className="grid-container"
        style={{
          display: "grid",
          gridTemplateColumns: isDetails ? "1fr" : "repeat(3, 1fr)",
          gap: 20,
          maxWidth: 1200,
          width: "100%",
        }}
      >
        {isDetails ? (
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              padding: 20,
              backgroundColor: "green",
              borderRadius: 8,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            {pLoading && <div>در حال بارگذاری...</div>}
            {pError && <div style={{ color: "crimson" }}>{pError}</div>}

            {selectedProduct && (
              <>
                <img
                  src={selectedProduct.thumbnail}
                  alt={selectedProduct.title}
                  style={{ width: "100%", borderRadius: 8 }}
                />
                <h2>{selectedProduct.title}</h2>
                <p>{selectedProduct.description}</p>
                <p style={{ fontWeight: "bold" }}>قیمت: ${selectedProduct.price}</p>
                <p>برند: {selectedProduct.brand}</p>
                <p>دسته‌بندی: {selectedProduct.category}</p>
                <p>امتیاز: {selectedProduct.rating}</p>
                <p>موجودی: {selectedProduct.stock}</p>
              </>
            )}

            <button
              onClick={closeDetails}
              style={{
                marginTop: 16,
                padding: "10px 20px",
                backgroundColor: "#4da52aff",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                cursor: "pointer",
              }}
            >
              بازگشت به محصولات
            </button>
          </div>
        ) : (
          currentProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => openProduct(p)}
              style={{
                border: "1px solid #176100af",
                borderRadius: 8,
                padding: 10,
                textAlign: "center",
                backgroundColor: "#176100af",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                style={{ width: "100%", borderRadius: 8 }}
              />
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p style={{ fontWeight: "bold" }}>${p.price}</p>
              <p style={{ color: "#000000ff", fontSize: 12 }}>
                
              </p>
            </div>
          ))
        )}
      </div>

      {}
      {!isDetails && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={{
                padding: "8px 16px",
                backgroundColor: currentPage === index + 1 ? "#258300ff" : "#5eff00ff",
                color: currentPage === index + 1 ? "#00ff00ff" : "#258300ff",
                border: "1px solid #ccc",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
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

export default App;
