import Header from "./Header";

export default function Layout({children, title}) {
    return (
        <>
        <Header title={title}/>
            <div>
                {children}
            </div>
        </>
    );
}
