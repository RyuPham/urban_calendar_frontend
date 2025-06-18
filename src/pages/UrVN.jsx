import React from 'react';
import GioithieuUrban1 from '../assets/images/GioithieuUrban_1.png';

const UrVN = () => (
    <div className="urvn-container" style={{ padding: '40px 40px 60px 40px', width: '100%', minHeight: 'calc(100vh - 52px - 60px)' }}>
        <h1 style={{ color: '#2d3eaf', fontWeight: 500, fontSize: 32, marginBottom: 16 }}>
            GIỚI THIỆU VỀ CÔNG TY TNHH URBAN VIETNAM
        </h1>
        <div style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 12 }}>
            [Chúng tôi Công ty TNHH Urban Việt Nam]
        </div>
        <div style={{ fontSize: 25, marginBottom: 24, lineHeight: 1.7 }}>
            Nơi đào tạo nâng cao các tân kĩ sư chuyên ngành công nghệ IT để có thể thúc đẩy bản thân tiến lên phía trước, hòa nhập vào sự phát triển của thời đại công nghệ cao của thế giới và tạo ra những điều khác biệt cho bản thân.
        </div>
        <div style={{ background: '#f7fafd', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef', padding: 24, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260, display: 'flex', justifyContent: 'center' }}>
                <img
                    src={GioithieuUrban1}
                    alt="Giới thiệu Urban Vietnam"
                    style={{ width: '90%', maxWidth: 1000, borderRadius: 8, marginBottom: 16, margin: '0 auto', display: 'block' }}
                />
            </div>
        </div>
    </div>
);

export default UrVN;
