import { logMessages } from "../../src/utils/messages";

describe("logMessages", () => {
    describe("messaggio esistente", () => {
        const message = "alreadySubscribed";
        const expected = "Già sottoscritto al canale << default >>";
        
        test(".error(messaggio)", () => {
            const spyError = jest.spyOn(console, "error");
            logMessages.error(message, "default");
            
            expect(spyError).toHaveBeenCalledWith(expected);
        });
        
        test(".warn(messaggio)", () => {
            const spyWarn = jest.spyOn(console, "warn");
            logMessages.warn(message, "default");
            
            expect(spyWarn).toHaveBeenCalledWith(expected);
        });
        
        test(".info(messaggio)", () => {
            const spyInfo = jest.spyOn(console, "info");
            logMessages.info(message, "default");
    
            expect(spyInfo).toHaveBeenCalledWith(expected);
        });
    });
});