import Image from "next/image";
import styles from "./styles/page.module.css";
import imgHome from '../../public/img/image_home.png'
import imgForm from '../../public/img/form_home.png'
import {
    Box, Button,
    Card,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    OutlinedInput,
} from "@mui/material";

import Checkbox from '@mui/material/Checkbox';
import Link from "next/link";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.topo}>
                    <div>
                        <Image className={styles.imgTopo} src={imgHome} alt=""/>
                    </div>
                    <h1 className={styles.text}>VERIFIQUE AGORA SE <br/>A SUA PROPRIEDADE <br/>ESTÁ ELEGIVEL PARA<br/> PARTICIPAR DO </h1>
                    <h1 className={styles.prem} >PREM</h1>
                </div>
                <div>
                    <h1 className={styles.titleForm}>Como Funciona?</h1>
                </div>
                <div className={styles.container}>
                    <section className={styles.form} >
                        <Card className={styles.card} variant="outlined">
                            <span className={styles.label}>Número do CAR*</span>
                            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                                <FormControl fullWidth sx={{m: 1}}>
                                    <InputLabel htmlFor="outlined-adornment-amount">CAR</InputLabel>
                                    <OutlinedInput
                                        id="car"
                                        label="Car"
                                    />
                                </FormControl>
                            </Box>

                            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                                <FormGroup>
                                    <FormControlLabel  control={<Checkbox />}
                                                       labelPlacement="start"
                                                       label="Não sei o número do Car" />
                                </FormGroup>
                            </Box>

                            <span className={styles.label}>Telefone de contato whatsapp*</span>
                            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                                <FormControl fullWidth sx={{m: 1}}>
                                    <InputLabel htmlFor="outlined-adornment-amount">Telefone</InputLabel>
                                    <OutlinedInput
                                        id="elefone"
                                        label="Telefone"
                                    />
                                </FormControl>
                            </Box>

                            <span className={styles.label}>E-mail de contato*</span>
                            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                                <FormControl fullWidth sx={{m: 1}}>
                                    <InputLabel htmlFor="outlined-adornment-amount">Email</InputLabel>
                                    <OutlinedInput
                                        id="email"
                                        label="Email"
                                    />
                                </FormControl>
                            </Box>

                            <Button className={styles.buttonForm} fullWidth variant="contained" color="success">
                                <Link href="/auth">
                                    Consultar
                                </Link>
                            </Button>

                        </Card>

                    </section>
                    <section><h1><Image className={styles.imgSection} src={imgForm} alt=""/></h1></section>
                    <section><h1>....</h1></section>
                </div>
            </main>
        </div>
    );
}
