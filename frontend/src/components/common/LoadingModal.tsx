import React from 'react';
// import { Modal, Backdrop, CircularProgress } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(theme => ({
//     modal: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// }));

const LoadingModal: React.FC<{ open: boolean }> = ({ open }) => {
    // const classes = useStyles();

    return (
        <div></div>
        // <Modal
        //     open={open}
        //     onClose={null}
        //     className={classes.modal}
        //     closeAfterTransition
        //     BackdropComponent={Backdrop}
        //     BackdropProps={{
        //         timeout: 500,
        //     }}
        // >
        //     <CircularProgress color="inherit" />
        // </Modal>
    );
};

export default LoadingModal;
