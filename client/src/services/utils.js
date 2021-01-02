export const enterPressed = (e, targetFunc) => {
    let code = e.keyCode || e.which;
    if(code === 13) { 
        targetFunc()
    } 
}