const initMondayClient = require('monday-sdk-js');

const getItem = async (token, itemId) => {
    try {

        const mondayClient = initMondayClient({ token });

        mondayClient.setToken(token);

        const query = `query($itemId: [Int]) {
      items (ids: $itemId) {
        name
        column_values{
          id
          title
          text
          value
        }
      }
    }`;


        const variables = { itemId };
        const response = await mondayClient.api(query, { variables });

        // console.log(JSON.stringify(response))

        let idColuna = response.data.items[0];

        return idColuna;

    } catch (err) {
        console.error(err);
    }
}

const createItem = async (token, boardID, value) => {
    try {
        const mondayClient = initMondayClient({ token });

        const query = `mutation($nomeItem: String!, $columnVals: JSON!) 
        { create_item (board_id:${boardID}, item_name:$nomeItem column_values:$columnVals) 
          {id} 
      }`;

        const response = mondayClient.api(query, { variables: JSON.stringify(value) });

        console.log('query', query)
        console.log('value', JSON.stringify(value))

        console.log('-------------')
        console.log('response', response)

        return response
    } catch (err) {
        console.error(err);

    }
}

/**
 * @author Vitor Oliveira
 * @method
 * 
 * Faz uma query no Monday com em um valor definido de uma coluna
 * 
 * @param {String} token - Token de validação do Monday
 * @param {Integer} boardId - ID do Board
 * @param {JSON} value - JSON composto com {String}column_id para identificar a coluna e {String}column_value para identificar o valor a ser buscado(Dê preferência ao uso do .text ao .value) 
 * @returns {JSON}
*/
const getItemsByColumnValues = async (token, boardId, value) => {
    try {
        const mondayClient = initMondayClient();

        mondayClient.setToken(token);

        const query =
            `query {
      items_by_column_values (limit:100, board_id: ${boardId}, column_id: "${value.column_id}", column_value: "${value.column_value}") {
        id
        column_values{
          id
          title
          text
          value
        }
      }
  }`

        const response = await mondayClient.api(query);

        return response.data.items_by_column_values;
    } catch (err) {
        console.error(err);
    }
}

const setMultipleColumnValues = async (token, boardId, value, item_id) => {
    try {
        const mondayClient = initMondayClient();

        mondayClient.setToken(token);

        const query = `mutation {
      change_multiple_column_values (item_id: ${item_id}, board_id: ${boardId}, column_values: ${value}) {
        id
      }
    }`
        const response = await mondayClient.api(query);

        return response.data.change_multiple_column_values;
    } catch (err) {
        console.error(err);

    }
}

const getItemsFromDate = async (token, boardId, value, columns) => {
    try {
        const mondayClient = initMondayClient();

        let hoje = new Date();
        let date;
        let total = 0;

        mondayClient.setToken(token);

        for (let i = 1; i < 4; i++) {

            if (hoje.getDay() == 0) hoje.setDate(hoje.getDate() - 2);
            else if (hoje.getDay() == 6) hoje.setDate(hoje.getDate() - 1);
            else hoje.setDate(hoje.getDate() - 1);

            let day = hoje.getDate().toString();
            let month = (hoje.getMonth() + 1).toString();
            let year = hoje.getFullYear().toString();

            if (day.length == 1) day = `0${day}`;
            if (month.length == 1) month = `0${month}`;

            date = `${year}-${month}-${day}`;

            let query =
                `query {
            items_by_column_values (board_id: 1764332672, column_id: "name", column_value: "Vitor Oliveira - ${date}") {
                column_values(ids:"n_meros"){
                  text
                }
            }
        }`

            const response = await mondayClient.api(query);

            if (response.data.items_by_column_values.length == 0) {
                total += 0;
            } else {
                total += response.data.items_by_column_values[0].column_values[0].text;
            }
        }
        return total;
    } catch (err) {
        console.error(err);

    }
}

const deleteItemFromId = async (token, itemId) => {
    try {

        const mondayClient = initMondayClient({ token });

        mondayClient.setToken(token);

        const query = `mutation {
            delete_item (item_id: ${itemId}) {
                id
            }
        }`;


        const variables = { itemId };
        const response = await mondayClient.api(query, { variables });

        let idColuna = response.data.delete_item.id;

        return idColuna;

    } catch (error) {
        console.error(err);
    }
}

module.exports = {
    getItem,
    createItem,
    getItemsByColumnValues,
    setMultipleColumnValues,
    getItemsFromDate,
    deleteItemFromId
};
