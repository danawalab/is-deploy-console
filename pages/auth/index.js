import {Box, Button, FormControl, Input, InputLabel, TextField} from "@mui/material";
import styles from "./_auth.module.scss"
import Grid from "@mui/material/Unstable_Grid2";

export default function Auth() {

    

    return (
        <Box className={styles.box}>
            <h1 className={styles.title}>개발자 관리도구</h1>
            <Grid container spacing={2}>
                <Grid xs={12} className={styles.id}>
                    <FormControl fullWidth>
                        <TextField label={'아이디'}/>
                    </FormControl>
                </Grid>
                <Grid xs={12} className={styles.pwd}>
                    <FormControl fullWidth>
                        <TextField label={'비밀번호'} type={'password'}/>
                    </FormControl>
                </Grid>
                <Grid xs={12} className={styles.btn}>
                    <Button variant={'contained'} fullWidth>로그인</Button>
                </Grid>
            </Grid>
        </Box>
    );
}