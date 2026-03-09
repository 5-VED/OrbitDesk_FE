import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

const pageTransition = {
    duration: 0.25,
    ease: 'easeOut',
};

export function AnimatedPage({ children, className = '' }) {
    return (
        <motion.div
            className={className}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const staggerItem = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export function StaggerContainer({ children, className = '' }) {
    return (
        <motion.div
            className={className}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = '' }) {
    return (
        <motion.div className={className} variants={staggerItem}>
            {children}
        </motion.div>
    );
}
