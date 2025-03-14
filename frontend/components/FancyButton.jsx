import "react";
import styles from "./Quiz.module.css";

// eslint-disable-next-line react/prop-types
const FancyButton = ({ children, onClick, btnColor = "gray" }) => {
    return (
        <button
            className={styles.fancyBtn}
            onClick={onClick}
            style={{ background: btnColor }}>
            {children}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="rgba(255, 255, 255, 0)"
                />
                {/* 生成波点 */}
                {Array.from({ length: 10 }).map((_, row) =>
                    Array.from({ length: 20 }).map((_, col) => {
                        const offsetX = row % 2 === 0 ? 3 : 0;
                        const distance = Math.hypot(row, col);
                        const radius = Math.max(0.2, 2 - distance * 0.07);
                        const alpha = Math.max(0.2, 0.8 - distance * 0.07);
                        const delay = (col / 50) * 1.5;

                        return (
                            <circle
                                key={`${row}-${col}`}
                                cx={col * 5 + 5 + offsetX}
                                cy={row * 5 + 5}
                                r={radius}
                                fill={`rgba(255, 255, 255, ${alpha.toFixed(
                                    2
                                )})`}
                                className={styles.animatedDot}
                                style={{ animationDelay: `${delay}s` }}
                            />
                        );
                    })
                )}
            </svg>
        </button>
    );
};

export default FancyButton;
