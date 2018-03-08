[{
    id: '',
    name: 'Eugene',
    room: 'The room'
}]

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = { id, name, room };
        this.users.push(user);
        return user
    }

    removeUser(id) {
        var user = this.getUser(id);
    this.users=this.users.filter((user) => user.id !== id);
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0]
    }

    getUserList(room, userName) {
        var users = this.users.filter((user) => user.room === room)
        var namesArray = users.map((user) => user.name);
        var unique = namesArray.filter((v, i, a) => a.indexOf(v) === i)
        return unique
    }
}



module.exports = { Users };
