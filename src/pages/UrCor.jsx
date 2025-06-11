import React from 'react';
import Urhistory from '../assets/images/ForUrbanCor/Urhistory.jpg';
import Urlocation from '../assets/images/ForUrbanCor/Urlocation.jpg';
import UrOrganization from '../assets/images/ForUrbanCor/UrOrganization.jpg';
import UrEvent from '../assets/images/ForUrbanCor/UrEvent.jpg';
import UrYokohama from '../assets/images/ForUrbanCor/UrYokohama.jpg';
import Urlotrinh from '../assets/images/ForUrbanCor/Urlotrinh.jpg';
import Urchedo from '../assets/images/ForUrbanCor/Urchedo.jpg';

const UrCor = () => (
    <div style={{ padding: '32px 16px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ color: '#2d3eaf', fontWeight: 500, fontSize: 32, marginBottom: 16 }}>
            GIỚI THIỆU VỀ URBAN CORPORATION
        </h1>
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>
            [GIỚI THIỆU VỀ URBAN CORPORATION]
        </div>
        <div style={{ fontSize: 17, marginBottom: 24, lineHeight: 1.7 }}>
            Urban Corporation là công ty mẹ của Urban Việt Nam, chuyên đào tạo và phát triển nguồn nhân lực IT cho thị trường Nhật Bản. Chúng tôi cung cấp môi trường làm việc chuyên nghiệp, cơ hội phát triển bản thân và chế độ đãi ngộ hấp dẫn.
        </div>
        <div style={{ background: '#f7fafd', borderRadius: 12, boxShadow: '0 2px 8px #e0e7ef', padding: 24 }}>
            <h2 style={{ color: '#1a237e', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
                LỊCH SỬ HÌNH THÀNH
            </h2>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
                Urban Corporation được thành lập với sứ mệnh đào tạo và phát triển nguồn nhân lực IT chất lượng cao cho thị trường Nhật Bản. Với kinh nghiệm nhiều năm trong lĩnh vực công nghệ thông tin, chúng tôi tự hào là đối tác tin cậy của nhiều doanh nghiệp lớn tại Nhật Bản.
            </p>
            <img src={Urhistory} alt="Lịch sử Urban Corporation" style={{ width: '100%', borderRadius: 8, marginBottom: 24 }} />

            <h2 style={{ color: '#1a237e', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
                ĐỊA ĐIỂM TRỤ SỞ
            </h2>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
                Trụ sở chính của Urban Corporation đặt tại Nhật Bản, với các chi nhánh và văn phòng đại diện tại nhiều thành phố lớn. Chúng tôi cung cấp môi trường làm việc hiện đại, chuyên nghiệp và đầy đủ tiện nghi cho nhân viên.
            </p>
            <img src={Urlocation} alt="Địa điểm trụ sở" style={{ width: '100%', borderRadius: 8, marginBottom: 24 }} />

            <h2 style={{ color: '#1a237e', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
                TỔ CHỨC VÀ HOẠT ĐỘNG
            </h2>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
                Urban Corporation tổ chức nhiều hoạt động ngoại khóa và sự kiện team building để tăng cường tinh thần đoàn kết và sự gắn bó giữa các thành viên. Chúng tôi cũng là nhà tài trợ chính thức cho đội bóng YOKOHAMA, thể hiện cam kết của chúng tôi trong việc phát triển cộng đồng.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <img src={UrOrganization} alt="Tổ chức Urban Corporation" style={{ width: '100%', borderRadius: 8 }} />
                <img src={UrEvent} alt="Hoạt động ngoại khóa" style={{ width: '100%', borderRadius: 8 }} />
                <img src={UrYokohama} alt="Đội bóng YOKOHAMA" style={{ width: '100%', borderRadius: 8 }} />
            </div>

            <h2 style={{ color: '#1a237e', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
                LỘ TRÌNH ĐÀO TẠO
            </h2>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
                Chúng tôi cung cấp chương trình đào tạo toàn diện bao gồm:
            </p>
            <ul style={{ fontSize: 16, marginBottom: 16, paddingLeft: 24 }}>
                <li>Đào tạo chuyên môn IT</li>
                <li>Đào tạo tiếng Nhật (yêu cầu tối thiểu N3)</li>
                <li>Đào tạo kỹ năng mềm và văn hóa doanh nghiệp</li>
                <li>Cơ hội thực tập và làm việc tại Nhật Bản</li>
            </ul>
            <img src={Urlotrinh} alt="Lộ trình đào tạo" style={{ width: '100%', borderRadius: 8, marginBottom: 24 }} />

            <h2 style={{ color: '#1a237e', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
                CHẾ ĐỘ VÀ ĐIỀU KIỆN GIA NHẬP
            </h2>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
                Urban Corporation cung cấp chế độ đãi ngộ hấp dẫn bao gồm:
            </p>
            <ul style={{ fontSize: 16, marginBottom: 16, paddingLeft: 24 }}>
                <li>Mức lương cạnh tranh</li>
                <li>Bảo hiểm y tế và các chế độ phúc lợi</li>
                <li>Cơ hội thăng tiến rõ ràng</li>
                <li>Môi trường làm việc quốc tế</li>
            </ul>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
                Điều kiện gia nhập:
            </p>
            <ul style={{ fontSize: 16, marginBottom: 16, paddingLeft: 24 }}>
                <li>Trình độ tiếng Nhật tối thiểu N3</li>
                <li>Kiến thức chuyên môn IT</li>
                <li>Tinh thần học hỏi và cầu tiến</li>
                <li>Khả năng làm việc nhóm tốt</li>
            </ul>
            <img src={Urchedo} alt="Chế độ và điều kiện gia nhập" style={{ width: '100%', borderRadius: 8 }} />
        </div>
    </div>
);

export default UrCor;
