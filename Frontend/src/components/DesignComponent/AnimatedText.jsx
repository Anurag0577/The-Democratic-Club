import { useEffect, useRef, useState } from 'react';

const AnimatedText = ({ text }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const words = text.split(' ');

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <p ref={ref} className=" space-mono-regular text-xl md:text-4xl max-w-[80%] text-left leading-5 md:leading-8 flex flex-wrap justify-center gap-x-3 gap-y-2">
            {words.map((word, i) => (
                <span
                    key={i}
                    className={`inline-block transition-all ease-out ${
                        isVisible
                            ? 'opacity-100 translate-y-0 text-white'
                            : 'opacity-0 translate-y-6 text-gray-500'
                    }`}
                    style={{
                        transitionDuration: '900ms',
                        transitionDelay: isVisible ? `${i * 45}ms` : '0ms',
                    }}
                >
                    {word}
                </span>
            ))}
        </p>
    );
};

export default AnimatedText;