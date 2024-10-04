
export const phoneIsValid = (phone: string) => {
    const checkingLength = 16;

    phone = phone.substring(0,checkingLength)
    let isValid = true;
    if (!phone || phone.length !== checkingLength)
    {
        isValid = false;
    }

    return isValid;
}

export const emailIsValid = (email:string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const maskInput = (value: string, mask: string) => {
    const literalPattern = /[0]/;
    const numberPattern = /[0-9]/;

    let newValue = "";

    let valueIndex = 0;

    for (let i = 0; i < mask.length; i++) {
        if (i >= value.length) break;
        if (mask[i] === "0" && !numberPattern.test(value[valueIndex])) break;
        while (!literalPattern.test(mask[i])) {
            if (value[valueIndex] === mask[i]) break;
            newValue += mask[i++];
        }
        newValue += value[valueIndex++];
    }
    return newValue;
}