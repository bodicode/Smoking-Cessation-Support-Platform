import {
    FaFacebookF,
    FaXTwitter,
    FaInstagram,
    FaPinterestP,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa6";
import FixedMap from "./FixedMap";

const Footer = () => {
    return (
        <footer className="bg-[#60C3A4] text-white py-10 px-6 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <div className="mb-4">
                        <hr />
                        <h4 className="text-2xl text-left font-bold my-4  text-nowrap text-accent uppercase">
                            ReAir
                        </h4>
                    </div>
                    <p className="text-yellow-400 font-semibold mb-2">Đăng ký ngay</p>
                    <form className="flex bg-white rounded overflow-hidden w-full max-w-xs">
                        <input
                            type="email"
                            placeholder="Email"
                            className="text-black px-3 py-2 w-full focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-400 px-4 text-black font-bold"
                        >
                            →
                        </button>
                    </form>
                    <div className="flex space-x-4 mt-4 text-white text-lg">
                        <FaFacebookF />
                        <FaXTwitter />
                        <FaInstagram />
                        <FaPinterestP />
                        <FaLinkedinIn />
                        <FaYoutube />
                    </div>
                    <p className="text-sm mt-6">
                        ReAir,
                        <br />
                        Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
                    </p>
                </div>

                <div className="mx-auto">
                    <hr />
                    <h4 className="text-2xl text-left font-bold my-4 text-nowrap text-accent uppercase">
                        Liên kết nhanh
                    </h4>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:underline">Về chúng tôi</a></li>
                        <li><a href="#" className="hover:underline">Liên hệ với chúng tôi</a></li>
                        <li><a href="#" className="hover:underline">Cách cai nghiện</a></li>
                        <li><a href="#" className="hover:underline">Tin tức</a></li>
                        <li><a href="#" className="hover:underline">Kết nối với cộng đồng</a></li>
                        <li><a href="#" className="hover:underline">Giúp đỡ người khác</a></li>
                    </ul>
                </div>
                <FixedMap />
            </div>
            <div className="mt-4 text-center py-3 text-sm">
                Bản quyền © 2025 bởi ReAir. Mọi quyền hạn không được phép sao chép.
            </div>
        </footer>
    );
}

export default Footer