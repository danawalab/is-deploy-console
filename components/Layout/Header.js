import styles from './_header.module.scss';

export default function Header({title}) {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>
                {title}
            </h1>
        </div>
    );
}