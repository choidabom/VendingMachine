import { queryTransaction } from "../db/db";

// 자판기 존재 여부
async function checkingVMid(vmID: number) {
    try {
        const checkVM = `
        SELECT * FROM vending_machine WHERE id=${vmID}
        `;
        const checkingIDResult = await queryTransaction(checkVM);
        return checkingIDResult.length;
    } catch (err) {
        console.error('Checking Vending Machine id is failed', err);
    }
};


// 자판기 resource 추가 : default resource의 목록을 조회하면서, vm_resource에 없는 resource 추가
async function addingDefaultResource(vmID: number) {
    try {
        const checkingExist = `
            INSERT INTO vm_resource (vm_id, resource_id, name, quantity)
            SELECT ${vmID}, resource_id, name, quantity FROM default_resource
            WHERE NOT EXISTS (SELECT * FROM vm_resource
            WHERE vm_id = ${vmID} AND resource_id = default_resource.resource_id)
        `;
        await queryTransaction(checkingExist);
    } catch (err) {
        console.error('Adding Default Resource is failed', err);
    }
}


// 자판기 객체 DB 추가 
async function insertVendingMachine(vmID: number) {
    const insertingVM = `
            INSERT INTO vending_machine (id, location)
            VALUES (${vmID}, "seoul")
        `;
    await queryTransaction(insertingVM);
};

export { checkingVMid, addingDefaultResource, insertVendingMachine };