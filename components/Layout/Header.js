import styles from './_header.module.scss';

export default function Header() {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>
                Is Deploy Console
            </h1>
        </div>
    );
}