import React from 'react';
import logo from './delete.png';
import './App.css';

/*
let items = [
  {id: 1, name: '', count: 1, price: 50000},
  {id: 2, name: '', count: 1, price: 20000},
  {id: 3, name: '', count: 1, price: 25000}
]
*/

function App() {
  return (
    <div>
      <Title />
      <Cart/>
    </div>
  );
}

function Title(){
  return (
    <header>
      Корзина
    </header>
  )
}

class Cart extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      items: [],
      total_price: 0
    }

    this.fetchDataGet()
  }

  fetchDataGet(){
    let item = []

    fetch('http://localhost:8080/get-cars', {method: "GET"})
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.cars.length; i++) {
        item[i] = {};
        item[i].id = data.cars[i].id;
        item[i].name = data.cars[i].name;
        item[i].count = 1;
        item[i].price = data.cars[i].price;
      }
    })
    .then(x => {
      this.setState({items: item})
      this.calculatePrice()
    })
  }

  calculatePrice(){
    let price = 0;

    for (let i = 0; i < this.state.items.length; i++){
      price += this.state.items[i].price * this.state.items[i].count
    }

    this.setState({total_price: price});
    //this.setState(this.state)
  }

  deleteItem(index){
    this.state.items.splice(index, 1)
    this.setState(this.state)

    this.calculatePrice()

    return(
      this.render()
    )
  }

  handleClick(i, index){
    let arr = this.state.items.slice();
    arr[i].count = index.target.value;
    this.setState({items: arr})

    this.calculatePrice()
  }

  makeOrder(){
    let cartIsNull = false;
    if (this.state.items.length === 0) cartIsNull = true;

    this.state.items.splice(0, this.state.items.length)
    this.setState({total_price: 0})

    if (cartIsNull){
      return (
          <div>
          {alert('Корзина пуста, заказывать нечего!')}
          {this.render()}
          </div>
      );
    }
    else{
      this.fetchDataPost()
      return (
        <div>

          {this.render()}
          </div>
      );
    }

  }

  fetchDataPost(){
    let srcData = "str";

    fetch('http://localhost:8080/buy-cars', {
      body: {srcData: srcData},
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
     })
  }

  render() {
    return(
      <div>
        <table border="1" cellPadding="25" cellSpacing="0">
          <tbody>
            <tr>
              <th width="10%">ID</th>
              <th width="50%">Название</th>
              <th width="20%">Цена</th>
              <th width="10%">Количество</th>
              <th width="10%">Удаление</th>
            </tr>
            {this.state.items.map((item, index) => (
              <tr key={index}>
                <td align="middle">{item.id}</td>
                <td className="car">{item.name}</td>
                <td align="middle" className="price">{item.price}</td>
                <td align="middle">
                  <input className="count-auto" size="5" type="text" value={item.count} onChange={this.handleClick.bind(this, index)}/>
                </td>
                <td>
                  <button className="delete-auto" type="submit" name="delete" onClick={() => { this.deleteItem(index) }}>
                    <img width="20%" src={logo} alt="Delete"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table-price" border="1" cellPadding="25" cellSpacing="0">
          <tbody>
            <tr>
              <td width="30%"><b>Полная цена</b></td>
              <td align="middle"><span id="total-price">{this.state.total_price}</span> руб.</td>
            </tr>
          </tbody>
        </table>
          <footer>
              <button id="go-to-order" onClick={() => this.makeOrder()}>
                Оформить заказ
              </button>
          </footer>
      </div>
    );
  }
}

export default App;
