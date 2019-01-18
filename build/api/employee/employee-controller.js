"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
class EmployeeController {
    constructor(configs) {
        this.backendBaseUrl = configs.get("Backend_host");
        this.backendPort = configs.get("Backend_port");
        this.backendUrl = configs.get("Backend_url");
    }
    async employeeController(request, h) {
        // This controller controls behaviour for base route /employees
        return true;
    }
    // This controller controls behaviour for base route /employees
    async employeeCreationController(request, h) {
        let reqData = request.payload;
        console.log(reqData);
        let userId = reqData.data.id;
        const db = request.getDb();
        const userModel = db.getModel('User');
        const empModel = db.getModel('Employee');
        let user = await userModel.findOne({ where: {
                User_id: userId
            } });
        let companyId = user.dataValues.Company_id;
        let dbEmp = await empModel.create({
            Name: reqData.data.employee.name.toString(),
            Hire_date: reqData.data.employee.hire_date,
            Designation: reqData.data.compensation.title.toString(),
            Payroll_amt: isNaN(parseInt(reqData.data.compensation.amount, 10)) ? null : parseInt(reqData.data.compensation.amount, 10),
            Company_id: companyId,
            Email: reqData.data.employee.email,
            Freq: reqData.data.compensation.freq,
            Employee_type: reqData.data.compensation.empType
        }).then((dbEmp) => {
            console.log("created:", dbEmp);
            return dbEmp;
        });
    }
    async employeeList(request, h) {
        let reqData = request.payload;
        console.log(reqData);
        let userId = reqData.user;
        let employeeList = [];
        const db = request.getDb();
        const userModel = db.getModel('User');
        const empModel = db.getModel('Employee');
        let user = await userModel.findOne({ where: {
                User_id: userId
            } });
        let employees = await empModel.findAll({
            where: {
                Company_id: user.dataValues.Company_id
            }
        }).then(employees => {
            console.log("found this: ");
            console.log(employees);
            return employees;
        });
        for (let employee of employees) {
            console.log("in for loop");
            let empName = employee.dataValues.Name.toString();
            let empObj = {
                name: empName,
                designation: employee.dataValues.Designation,
                payAmt: employee.dataValues.Payroll_amt
            };
            employeeList.push(empObj);
        }
        if (employeeList.length > 0) {
            return h.response(employeeList);
        }
        else {
            return null;
        }
    }
    async payrollListEmployees(request, h) {
        let reqData = request.payload;
        console.log(reqData);
        let payrollId = reqData.payroll_id;
        let employeeList = [];
        let payrollList = {
            data: { total_amt: null },
            empReceived: null
        };
        const db = request.getDb();
        const payrollModel = db.getModel('Payroll');
        const empModel = db.getModel('Employee');
        let payroll = await payrollModel.findOne({ where: {
                Payroll_id: payrollId
            } });
        payrollList.data.total_amt = payroll.dataValues.Total_amt;
        let employees = await empModel.findAll({
            where: {
                Company_id: payroll.dataValues.Company_id,
                Payroll_id: payrollId
            }
        }).then(employees => {
            console.log("found this: ");
            console.log(employees);
            return employees;
        });
        for (let employee of employees) {
            let empName = employee.dataValues.Name.toString();
            let empObj = {
                empId: employee.dataValues.Emp_id,
                name: empName,
                designation: employee.dataValues.Designation,
                payAmt: employee.dataValues.Payroll_amt
            };
            employeeList.push(empObj);
        }
        payrollList.empReceived = employeeList;
        return h.response(payrollList);
    }
    async payrollEligibleEmployeeList(request, h) {
        let reqData = request.payload;
        console.log(reqData);
        let userId = reqData.user;
        let employeeList = [];
        const db = request.getDb();
        const userModel = db.getModel('User');
        const empModel = db.getModel('Employee');
        let user = await userModel.findOne({ where: {
                User_id: userId
            } });
        let employees = await empModel.findAll({
            where: {
                Company_id: user.dataValues.Company_id,
                Payroll_id: { [Op.eq]: null },
                User_id: { [Op.ne]: null }
            }
        }).then(employees => {
            console.log("found this: ");
            console.log(employees);
            return employees;
        });
        for (let employee of employees) {
            let empName = employee.dataValues.Name.toString();
            let empObj = {
                empId: employee.dataValues.Emp_id,
                name: empName,
                designation: employee.dataValues.Designation,
                payAmt: employee.dataValues.Payroll_amt
            };
            employeeList.push(empObj);
        }
        return h.response(employeeList);
    }
}
exports.default = EmployeeController;
