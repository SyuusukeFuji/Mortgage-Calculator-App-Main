
import React,{useState} from "react";
import {NumericFormat, NumberFormat} from "react-number-format";

function DataFields(){
    const[showResult, setShowResult]= useState(false);
    const[amount, setAmount]= useState("");
    const[term, setTerm]= useState("");
    const[rate, setRate]= useState("");
    const[monthly, setMonthly]=useState("");
    const[total, setTotal]=useState("");
    const[selectedRadio, setSelectedRadio]= useState(0);

    let mortType="";

    function cleanFormulary(){
        setAmount("");
        setTerm("");
        setRate("");

        const radioFields= document.getElementsByClassName("radio-sections");
        const radio= [document.getElementById("radio1"), document.getElementById("radio2")];
        for(const rb of radio){
            if(rb.checked){
                rb.checked= false;
                radioFields[radio.indexOf(rb)].classList.remove("checked-radio");
            }
        }

        
    }

    function handleMortgage(event){
        event.preventDefault();
        const mortAmount= parseFloat(amount.replace(/,/g, ''))
        const mortRate= parseFloat(rate);
        const mortYears= parseInt(term)

        if(!handleValidation()){
            console.log("something did not pass validation");
            return;
        }
        /*interest monthly */
        const r= mortRate/12/100;
        console.log("mortType is: " +mortType);


        if(mortType=="repayment"){
            const n= mortYears*12;
        const M= mortAmount * r * Math.pow(1 + r, n)/(Math.pow(1 + r, n)-1);
        const totalPaid= M*n;
        setMonthly(M.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }));
        setTotal(totalPaid.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }));

        }else if(mortType=="interest"){
            const M = mortAmount * r;
            const totalPaid = M * 12 * mortYears;
            setMonthly(M.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));
            setTotal(totalPaid.toLocaleString('en-US', {
             minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));
        }


        /*total number of payments */
        
        setShowResult(true);
        
    }

    function handleValidation(){
        const fieldLog= [];
        

        const fieldErrors= [document.getElementById("error-1"),
            document.getElementById("error-2"),
            document.getElementById("error-3")
        ];

        const radioError=document.getElementById("error-4");

        const radioButtons=[document.getElementById("radio1"), document.getElementById("radio2")];

        const dataFields= [
            document.getElementById("input-amount"), document.getElementById("input-term"), 
            document.getElementById("input-rate")];
        console.log("Data fields length is: " + dataFields.length);

        for(let i=0; i<dataFields.length; i++){
            if(!dataFields[i].value){
                console.log("uhm, seems like a field is empty");
                fieldErrors[i].classList.add("on-visibility");
                fieldLog.push(false);
            }
            if(dataFields[i].value){
                fieldErrors[i].classList.remove("on-visbility");
                fieldLog.push(true);
            }
        }

        //radio buttons validation
        let rbIndex=0;
        let isRbChecked=false;
        for(const rb of radioButtons){
            if(rb.checked){
                console.log("A radio button is checked");
                isRbChecked= true;
                mortType= rb.value;
                console.log("the mort type is: "+mortType);
                break;
            }
            console.log("no radio was clicked")
        }

        console.log("is RB checked= " + isRbChecked);

        if(isRbChecked){
            radioError.classList.remove("on-visibility");
        }else{
            radioError.classList.add("on-visibility");
        }

        if(!fieldLog || !isRbChecked){
            return false;
        }

        return true;
    }

    function handleRadioButtons(radioID){
        //Handles radio buttons "live" changes
        let i=selectedRadio;
        console.log("a Radio Button has been clicked");
        const radioFields= document.getElementsByClassName("radio-sections");
        if(radioID=="radio1"){
        
            console.log("radio id is: "+radioID);
            radioFields[0].classList.add("checked-radio");
            radioFields[1].classList.remove("checked-radio");
            
        }else{
            console.log("radio id is: "+radioID);
            radioFields[1].classList.add("checked-radio");
            radioFields[0].classList.remove("checked-radio");

        }
        i++;
        console.log(i);
        setSelectedRadio(i);
        
    }

    
    return(
        <section id="outer-card">
            <section id="data-side">
                <header id="card-header">
                    <h1 id="app-title">Mortgage Calculator</h1>
                    <button id="clear-bt" onClick={()=>cleanFormulary()}>Clear All</button>
                </header>
                <section id="amount-section" className="vertical-content">
                    <p className="data-title">Mortgage Amount</p>
                    {/**/}
                    <section id="amount-wrap" className="span-input">
                    <span id="pound-span" className="field-spans">£</span>
                    <NumericFormat id="input-amount" className="input-style" value={amount} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} onChange={(e) => setAmount(e.target.value)} />
                    </section>
                    <p id="error-1" className="error-msgs">This field is required</p>        
                </section>
                
                <section id="term-rate-section" >
                    <section id="term-section">
                        <p className="data-title">Mortgage Term</p>
                        <section id="term-wrap" className="span-input">
                            <input id="input-term" value={term} type="text" onChange={(e) => setTerm(e.target.value)} className="term-rate-inputs input-style"/>
                            <span id="term-span" className="field-spans">years</span>
                        </section>
                        
                        <p id="error-2" className="error-msgs">This field is required</p>
                    </section>
                    <section id="rate-section" >
                        <p className="data-title">Interest Rate</p>
                        <section id="rate-wrap" className="span-input">
                            <NumericFormat id="input-rate" value={rate} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} onChange={(e) => setRate(e.target.value)} className="term-rate-inputs input-style" />
                            <span id="rate-span" className="field-spans">%</span>
                        </section>
                        
                        <p id="error-3" className="error-msgs">This field is required</p>
                    </section>
                </section>

                <section id="mortgage-type-section" className="vertical-content">
                    <p className="data-title">Mortgage Type</p>
                    <section id="radio-section-repayment" className="radio-sections">
                        <input id="radio1" type="radio" value="repayment" name="mortgage-type" onClick={()=>handleRadioButtons("radio1")}/>
                        <p className="radio-text">Repayment</p>
                    </section>
                    <section id="radio-section-interest" className="radio-sections">
                        <input id="radio2" type="radio" value="interest" name="mortgage-type" onClick={()=>handleRadioButtons("radio2")} />
                        <p className="radio-text">Interest Only</p>
                    </section>
                    <p id="error-4" className="error-msgs">This field is required</p>
                </section>

                <button id="result-bt" onClick={handleMortgage}>
                    <img id="button-pic" src="/assets/images/icon-calculator.svg" alt="calculator-icon" />
                    Calculate Repayments
                </button>
            </section>

            <section id="results-side">
                {
                    !showResult ? (
                        <section id="empty-results">
                            <img src="/assets/images/illustration-empty.svg" alt="" />
                            <h2 className="right-side-title">Results shown here</h2>
                            <p className="right-side-pgraph">Complete the form and click “calculate repayments” to see what 
                            your monthly repayments would be.</p>
                        </section>
                        
                    ) : (
                        <section id="calculated-results">
                            <h2 className="right-side-title">Your results</h2>
                            <p id="results-desc" className="right-side-pgraph">Your results are shown below based on the information you provided. 
                            To adjust the results, edit the form and click “calculate repayments” again.</p>
                            <section id="results-wrapper">
                                <p className="right-side-pgraph">Your monthly repayments</p>
                                <h3 className="result-repayments">£{monthly}</h3>
                                <hr id="divider" className="solid"/>
                                <p className="right-side-pgraph">Total you'll repay over the term</p>
                                <h4>£{total}</h4>
                            </section>
                        </section>
                    )
                }
            </section>


        </section>
        
    )
}

export default DataFields;