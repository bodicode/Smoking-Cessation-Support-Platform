import Image from 'next/image';

const Logo = () => {
    return (
        <div className="flex items-center">
            <Image
                src="/images/logo.png"
                alt="ReAir Logo"
                width={60}
                height={60}
                priority 
            />
        </div>
    );
};

export default Logo;
