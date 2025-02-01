import styles from './styles.module.css'
import Link from "next/link"
import Image from "next/image";
import logo from '../../../../public/img/logo.png';
import {Button} from "@mui/material";


export default function Header(){
    return (
        <header className={styles.header}>
            <section className={styles.content}>
                <nav>
                    <Link href="/">
                        <Image src={logo} alt="Home"/>
                    </Link>
                </nav>
                <Button variant="contained" color="success">
                    <Link href="/auth">
                        Login
                    </Link>
                </Button>
            </section>

        </header>
    )
}
