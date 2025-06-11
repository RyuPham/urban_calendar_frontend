import React from "react";

const Footer = () => (
  <div
    style={{
      width: "100%",
      background: "#f7f7f7",
      padding: "32px 0",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 64,
    }}
  >
    {/* Thông tin công ty */}
    <div style={{ flex: 1, maxWidth: 500 }}>
      <h3 style={{ color: "#1a33d5", marginBottom: 16 }}>CÔNG TY TNHH URBAN VIỆT NAM</h3>
      <div style={{ color: "#1a33d5", fontWeight: 600 }}>
        Địa chỉ : <span style={{ color: "#222", fontWeight: 400 }}>345/134 Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TPHCM</span>
      </div>
      <div style={{ color: "#1a33d5", fontWeight: 600 }}>
        Hotline : <span style={{ color: "#222", fontWeight: 400 }}>0909 260040</span>
      </div>
      <div style={{ color: "#1a33d5", fontWeight: 600 }}>
        Email : <span style={{ color: "#222", fontWeight: 400 }}>server@urbanvietnam.vn</span>
      </div>
    </div>
    {/* Bản đồ */}
    <div style={{ flex: 1, maxWidth: 500 }}>
      <h3 style={{ color: "#1a33d5", marginBottom: 16 }}>BẢN ĐỒ</h3>
      <iframe
        title="urban-map"
        src="https://www.google.com/maps?q=345%2F134%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%2C%20Ph%C6%B0%E1%BB%9Dng%20C%E1%BA%A7u%20Kho%2C%20Qu%E1%BA%ADn%201%2C%20TPHCM&output=embed"
        width="100%"
        height="220"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
);

export default Footer;
