var computersHandler = {
    vm: {},
    init: function (vm) {
        computersHandler.vm = vm;
    },
    addComputers: function () {
        if(computersHandler.vm.addedComputers){
            computersHandler.vm.computers = [];
        }        
        
        for (var i = 0; i < computersHandler.vm.computers.length; i++) {
            if (targetArray.indexOf(checkerArray[i]) === -1) {
                //addedComputers.push[]
            }
        }
        
    }
};