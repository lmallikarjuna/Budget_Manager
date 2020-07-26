/**********************************************************************************************************************************/
/***************************************************Budget Controller**************************************************************/

const BudgetController = (function () {
  // Function Constructor for Income

  function newItemObject(ID, description, amount) {
    this.ID = ID;
    this.description = description;
    this.amount = amount;
  }

  const DataBase = {
    allItems: {
      income: [],
      expense: [],
    },
    totals: {
      totalSum: 0,
      totalIncome: 0,
      totalExpense: 0,
    },
  };

  return {
    addNewItem: function (inputObject) {
      let newItem, ID;

      if (DataBase.allItems[inputObject.type].length > 0) {
        ID =
          DataBase.allItems[inputObject.type][
            DataBase.allItems[inputObject.type].length - 1
          ].ID + 1;
      } else {
        ID = 0;
      }

      console.log(parseFloat(inputObject.amount));

      if (inputObject.type === "income") {
        newItem = new newItemObject(
          ID,
          inputObject.description,
          inputObject.amount
        );
        DataBase.allItems.income.push(newItem);
        DataBase.totals.totalSum += parseFloat(inputObject.amount);
        DataBase.totals.totalIncome += parseFloat(inputObject.amount);
      } else if (inputObject.type === "expense") {
        newItem = new newItemObject(
          ID,
          inputObject.description,
          inputObject.amount
        );
        DataBase.allItems.expense.push(newItem);
        DataBase.totals.totalSum -= parseFloat(inputObject.amount);
        DataBase.totals.totalExpense += parseFloat(inputObject.amount);
      }
      return newItem;
    },

    deleteItem: function (type, ID) {
      let ids, index, deleted_object;

      ids = DataBase.allItems[type].map(function (current) {
        return current.ID;
      });
      console.log(ids);

      index = ids.indexOf(parseInt(ID));
      
      if(type === "income") {
        DataBase.totals.totalSum -= parseFloat(DataBase.allItems[type][index].amount);
        DataBase.totals.totalIncome -= parseFloat(DataBase.allItems[type][index].amount);
      } else if (type === "expense") {
        DataBase.totals.totalSum += parseFloat(DataBase.allItems[type][index].amount);
        DataBase.totals.totalExpense -= parseFloat(DataBase.allItems[type][index].amount);
      }

      if (index !== -1) {
        DataBase.allItems[type].splice(index, 1);
      }

      console.log(DataBase);
    },
    getTotalValues: function () {
      return DataBase.totals;
    },
  };
})();

/**********************************************************************************************************************************/
/***************************************************UI Controller******************************************************************/

const UIController = (function () {
  const DOMStrings = {
    add_to_list_button: ".add_to_list_button",
    income_or_expense: ".income_or_expense",
    input_description: ".input_description",
    input_value: ".input_value",
    income_list_wrapper: ".income_list_item_wrapper",
    expense_list_wrapper: ".expense_list_item_wrapper",
    item_delete_button: ".item_delete_button",
    list_main_container: ".list_main_container",
    total_value: ".total_value",
    total_income_value: ".total_income_value",
    total_expense_value: ".total_expense_value"
  };

  return {
    getDOMStrings: function () {
      return DOMStrings;
    },
    getInputValues: function () {
      return {
        //Check for income or expense
        type: document.querySelector(DOMStrings.income_or_expense).value,
        //Get value written in description
        description: document.querySelector(DOMStrings.input_description).value,
        // Get value written in value
        amount: document.querySelector(DOMStrings.input_value).value,
      };
    },
    addNewItemToUI: function (budgetObject, type) {
      let html;

      if (type === "income") {
        html = `<div class="income-item" id="income-${budgetObject.ID}">
            <p class="item_description">${budgetObject.description}</p>
            <p class="item_value">Rs.${budgetObject.amount}</p>
            <button class="item_delete_button">Delete</button>
            </div>`;
        document
          .querySelector(DOMStrings.income_list_wrapper)
          .insertAdjacentHTML("beforeend", html);
      } else if (type === "expense") {
        html = `<div class="expense_item" id="expense-${budgetObject.ID}">
            <p class="item_description">${budgetObject.description}</p>
            <p class="item_value">Rs.${budgetObject.amount}</p>
            <button class="item_delete_button">Delete</button>
            </div>`;
        document
          .querySelector(DOMStrings.expense_list_wrapper)
          .insertAdjacentHTML("beforeend", html);
      }
    },
    deleteItem: function (delete_item_id) {
      const item = document.getElementById(delete_item_id);

      item.parentNode.removeChild(item);
    },
    updateTotalValues: function (totalValuesObject) {
      document.querySelector(
        DOMStrings.total_value
      ).textContent = `Rs.${totalValuesObject.totalSum}`;
      document.querySelector(DOMStrings.total_income_value).textContent = `Rs.${totalValuesObject.totalIncome}`;
      document.querySelector(DOMStrings.total_expense_value).textContent = `Rs.${totalValuesObject.totalExpense}`;
    },
    clearInputFields: function () {
      document.querySelector(DOMStrings.input_description).value = "";
      document.querySelector(DOMStrings.input_value).value = "";
      document.querySelector(DOMStrings.input_description).focus();
    },
  };
})();

/**********************************************************************************************************************************/
/***************************************************Main Controller****************************************************************/

const MainController = (function (UIController, BudgetController) {
  const DOMStrings = UIController.getDOMStrings();

  function setEventListeners() {
    document
      .querySelector(DOMStrings.add_to_list_button)
      .addEventListener("click", addNewItem);

    document
      .querySelector(DOMStrings.list_main_container)
      .addEventListener("click", deleteItem);
  }

  function deleteItem(event) {
    const delete_item_id = event.target.parentNode.id;

    const [type, ID] = delete_item_id.split("-");

    // Delete the item in Budget Controller
    BudgetController.deleteItem(type, ID);
    const totalValuesObject = BudgetController.getTotalValues();

    // Delete the item in UI controller
    UIController.deleteItem(delete_item_id);
    UIController.updateTotalValues(totalValuesObject);
  }

  function addNewItem() {
    // Get Description, value and "income or expense" from UI
    const inputObject = UIController.getInputValues();

    // Clear input fields
    UIController.clearInputFields();

    // Update it to the Budget Controller
    const budgetObject = BudgetController.addNewItem(inputObject);

    // Get total Values
    const totalValuesObject = BudgetController.getTotalValues();

    // Show the new Item in the UI
    UIController.addNewItemToUI(budgetObject, inputObject.type);
    UIController.updateTotalValues(totalValuesObject);
  }

  return {
    init: function () {
      setEventListeners();
    },
  };
})(UIController, BudgetController);

/*********************************************************************************************************************************/

MainController.init();

/*********************************************************************************************************************************/
