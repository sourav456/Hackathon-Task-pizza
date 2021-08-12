import React from 'react'
 import "./home.css"

class Homepage extends React.Component {

    state = {
        toppingOptions: {
            pepperoni: {
                icons: ['gluten free'],
                amount: 12
            },
            bacon: {
                icons: ['gluten free'],
                amount: 13
            },
            ham: {
                icons: ['gluten free'],
                amount: 14
            },
            sausage: {
                icons: ['gluten free'],
                amount: 13
            },
            chicken: {
                icons: ['gluten free'],
                amount: 14
            },
            onions: {
                icons: ['vegetarian', 'gluten free'],
                amount: 15
            },
            peppers: {
                icons: ['vegetarian', 'gluten free'],
                amount: 15
            },
            mushrooms: {
                icons: ['vegetarian', 'gluten free'],
                amount: 22
            },
            pineapple: {
                icons: ['vegetarian', 'gluten free'],
                amount: 16
            },
            olives: {
                icons: ['vegetarian', 'gluten free'],
                amount: 19
            },
            jalapenos: {
                icons: ['vegetarian', 'gluten free', 'hot'],
                amount: 19
            },
            chillisauce:{
                icons: ['vegetarian', 'gluten free'],
                amount: 20
            }
        },
        selectedToppings: [],
        basePrice: 1000,
        toppingPrice: 150,
        discount: {
            userCode: '',
            applied: false,
            codes: {
                Sourav: 25,
                GUVI: 20,
                Independence: 30,
                Rakhi: 10,
                August: 15,
                pizza: 40,
                Sunday: 35
            }
        },
        orderConfirmed: false
    }

    confirmOrderBtnRef = React.createRef();
    closeConfirmationBtnRef = React.createRef();

    handleToppingOptionClick = e => {
        if (e.target.className === 'topping-input') {

            const selectedTopping = e.target.id;

            this.state.selectedToppings.includes(selectedTopping) ?
                this.setState(prevState => ({ selectedToppings: prevState.selectedToppings.filter(topping => topping !== selectedTopping) })) :
                this.setState(prevState => ({ selectedToppings: [...prevState.selectedToppings, selectedTopping] }));
        }
    }

    handleDiscountInput = e => {

        const value = e.target.value.trim().toLowerCase();

        this.setState(prevState => ({ discount: { ...prevState.discount, userCode: value } }));
        if (this.state.discount.applied) {
            this.setState(prevState => ({ discount: { ...prevState.discount, applied: false } }));
        }
    }

    handleDiscountClick = () => this.setState(prevState => ({ discount: { ...prevState.discount, applied: true } }));

    handleOrderSubmit = () => {
        this.setState(prevState => (
            { orderConfirmed: !prevState.orderConfirmed }
        ), () => {
            this.state.orderConfirmed ?
                this.closeConfirmationBtnRef.current.focus() :
                this.confirmOrderBtnRef.current.focus();
        })
    };

    render() {
        return (
            <React.Fragment>
                <Header />
                <main>
                    <div className='container'>
                        <ToppingSelect
                            toppingOptions={ Object.entries(this.state.toppingOptions) }
                            toppingPrice={ (this.state.toppingPrice / 100).toFixed(2) }
                            handleToppingOptionClick={ this.handleToppingOptionClick } />
                        <Pizza
                            selectedToppings={ this.state.selectedToppings }
                            toppingOptions={ this.state.toppingOptions } />
                        <OrderDetails
                            selectedToppings={ this.state.selectedToppings }
                            totalPrice={ ((this.state.basePrice + (this.state.toppingPrice * this.state.selectedToppings.length)) / 100).toFixed(2) }
                            discount={ this.state.discount }
                            confirmOrderBtnRef={ this.confirmOrderBtnRef }
                            handleDiscountInput={ this.handleDiscountInput }
                            handleDiscountClick={ this.handleDiscountClick }
                            handleOrderSubmit={ this.handleOrderSubmit }
                        />
                        {
                            this.state.orderConfirmed ?
                                <OrderConfirmation
                                    handleOrderSubmit={ this.handleOrderSubmit }
                                    closeConfirmationBtnRef={ this.closeConfirmationBtnRef }
                                />
                                : null
                        }
                    </div>
                </main>
            </React.Fragment>
        )
    }
}

function Header() {
    return (
        <header>
            <h1><span aria-hidden>🍕</span>Custom Pizza Maker<span aria-hidden>🍕</span></h1>
        </header>
    );
}

function ToppingSelect({ toppingOptions, toppingPrice, handleToppingOptionClick }) {
    return (
        <div className='topping-select'>
            <h2>Toppings</h2>
            <ul className='toppings-info'>
                <li><ToppingIcon iconType={ 'vegetarian' } /> Vegetarian</li>
                <li><ToppingIcon iconType={ 'gluten free' } /> Gluten Free</li>
                <li><ToppingIcon iconType={ 'hot' } /> Hot & Spicy</li>
            </ul>
            <p className='toppings-info'>Toppings charged at { `Rs${toppingPrice}` } each.</p>
            <ul className='topping-options' onClick={ handleToppingOptionClick }>
                { toppingOptions.map(topping => <ToppingOption key={ topping[0] } topping={ topping[0] } toppingIcons={ topping[1].icons } />) }
            </ul>
        </div >
    );
}

function ToppingOption({ topping, toppingIcons }) {
    return (
        <li className='topping-option'>
            <input type='checkbox' id={ topping } className='topping-input' />
            <label className='topping-label' htmlFor={ topping } aria-label={ `${topping} (${toppingIcons.map(icon => icon)})` }>
                <div className='topping-image'>
                    <div className={ `${topping} topping-image-item` }></div>
                </div>
                <span className='topping-label-content'>
                    <span className='topping-label-text'>
                        { topping }
                    </span>
                    <span className='topping-label-icons'>
                        { toppingIcons.map(icon => <ToppingIcon key={ icon } iconType={ icon } />) }
                    </span>
                </span>
            </label>
        </li>
    );
}

function ToppingIcon({ iconType }) {
    return (
        <span className={ `topping-icon ${iconType.split(' ')[0]}` } aria-label={ iconType }>
            { iconType.charAt(0).toUpperCase() }
        </span>
    );
}

function Pizza({ toppingOptions, selectedToppings }) {
    return (
        <div className='pizza-container'>
            <div className='pizza'>
                { selectedToppings.map(topping =>
                    <PizzaTopping key={ topping } topping={ topping } toppingAmount={ toppingOptions[topping].amount } />) }
            </div>
        </div>
    );
}

function PizzaTopping({ topping, toppingAmount }) {

    let toppings = [];

    for (let i = 1; i <= toppingAmount; i++) {
        toppings.push(<div key={ `${topping + i}` } className={ `topping ${topping} ${topping}-${i} ` } ></div>);
    }

    return toppings;
}

function OrderDetails({ selectedToppings, totalPrice, discount, confirmOrderBtnRef, handleDiscountInput, handleDiscountClick, handleOrderSubmit }) {

    const validDiscount = Object.keys(discount.codes).includes(discount.userCode);

    return (
        <div className='order'>
            <h2>Order Details</h2>
            <div className='order-toppings'>
                <h3>Toppings:</h3>
                <ul className='order-toppings-list'>
                    <li>Cheese</li>
                    { selectedToppings.map(topping => <li key={ topping }>{ topping }</li>) }
                </ul>
            </div>
            <div className='order-discount'>
                <h3>Discount Code:</h3>
                <input
                    type='text'
                    className='discount-input'
                    spellCheck='false'
                    value={ discount.userCode }
                    maxLength='10'
                    onChange={ handleDiscountInput }
                    aria-label='Discount Code'
                    aria-describedby='discount-message'
                    aria-invalid={ discount.applied && !validDiscount }
                />
                {
                    discount.applied ?
                        (validDiscount ?
                            <p id='discount-message' className='discount-message discount-message--valid' role='alert'>
                                Valid Code: { discount.codes[discount.userCode] }% Off
                            </p>
                            :
                            <p id='discount-message' className='discount-message discount-message--invalid' role='alert'>
                                Invalid Code
                            </p>)
                        : null
                }
                <button className='btn discount-btn' onClick={ handleDiscountClick } aria-label='Apply Discount'>Apply</button>
            </div>
            <div className='order-price'>
                <h3>Total Price:</h3>
                <p className='price'>
                    {
                        `Rs${discount.applied && validDiscount ?
                            (totalPrice - (totalPrice * (discount.codes[discount.userCode] / 100))).toFixed(2) : totalPrice}`
                    }
                </p>
                <button
                    className='btn order-btn'
                    onClick={ handleOrderSubmit }
                    aria-label='Confirm Order'
                    ref={ confirmOrderBtnRef }
                >
                    Order
                </button>
            </div>
        </div>
    );
}

function OrderConfirmation({ closeConfirmationBtnRef, handleOrderSubmit }) {
    return (
        <div className='order-confirmation'>
            <div className='order-modal'>
                <h2>Order Confirmed</h2>
                <p>Your pizza will be with you shortly!</p>
                <button
                    className='btn close-btn'
                    onClick={ handleOrderSubmit }
                    aria-label="Close Confirmation"
                    ref={ closeConfirmationBtnRef }
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default Homepage


