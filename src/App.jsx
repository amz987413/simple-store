const products = [
  {id : 1 , name:"محصول 1" , desc:"محصول یک" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 2 , name:"محصول 2" , desc:"محصول دوم" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 3 , name:"محصول 3" , desc:"محصول سه" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 4 , name:"محصول 4" , desc:"محصول چهار" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 5 , name:"محصول 5" , desc:"محصول پنج" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 6 , name:"محصول 6" , desc:"محصول شش" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 7 , name:"محصول 7" , desc:"محصول هفت" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 8 , name:"محصول 8" , desc:"محصول هشت" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 9 , name:"محصول 9" , desc:"محصول نه" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 10 , name:"محصول 10" , desc:"محصول ده" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 11 , name:"محصول 11" , desc:"محصول یازده" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},
  {id : 12 , name:"محصول 12" , desc:"محصول دوازده" , price:"10000" , img:"https://cgifurniture.com/_ipx/f_auto&s_1920x1080/cms/uploads/white_product_background_3d_render_headphones_01f9e40edb.jpg"},

]


function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#5e4444ff",
        minHeight: "100vh",
        
      }}
    >
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
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 10,
              textAlign: "center",
              backgroundColor: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={p.img}
              alt={p.name}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <p style={{ fontWeight: "bold" }}>{p.price}</p>
          </div>
        ))}
      </div>

      <style>{`
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