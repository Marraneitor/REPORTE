"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredData, setStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { CustomerForm } from "@/components/customers/customer-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Customer = {
  id: number;
  name: string;
  phone: string;
  address: string;
  points: number;
};

export default function CustomersPage() {
  // Start with empty initial state for SSR
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load data from localStorage after mount
  useEffect(() => {
    const storedCustomers = getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    setCustomers(storedCustomers);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    // Only save if we have loaded the initial data
    if (customers.length > 0) {
      setStoredData(STORAGE_KEYS.CUSTOMERS, customers);
    }
  }, [customers]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (data: { name: string; phone: string; address: string; points?: number }) => {
    const newCustomer: Customer = {
      id: Date.now(),
      name: data.name,
      phone: data.phone,
      address: data.address,
      points: data.points ?? 0
    };
    setCustomers(prev => [...prev, newCustomer]);
    setIsDialogOpen(false);
  };

  const handleUpdateCustomer = (data: { name: string; phone: string; address: string; points?: number }) => {
    if (!selectedCustomer) return;
    
    const updatedCustomer: Customer = {
      ...selectedCustomer,
      name: data.name,
      phone: data.phone,
      address: data.address,
      points: data.points ?? selectedCustomer.points
    };
    
    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(null);
    setIsDialogOpen(false);
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const getPointsStatus = (points: number) => {
    if (points >= 300) return { label: "VIP", class: "bg-green-500" };
    if (points >= 200) return { label: "Gold", class: "bg-yellow-500" };
    if (points >= 100) return { label: "Silver", class: "bg-gray-400" };
    return { label: "Bronze", class: "bg-amber-700" };
  };

  return (
    <div className="flex flex-col ml-0 md:ml-64">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                <DialogDescription>
                  {selectedCustomer
                    ? "Update customer information in the system."
                    : "Add a new customer to the system."}
                </DialogDescription>
              </DialogHeader>
              <CustomerForm
                customer={selectedCustomer}
                onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Manage customer information and loyalty points
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.points}</TableCell>
                      <TableCell>
                        <Badge className={getPointsStatus(customer.points).class}>
                          {getPointsStatus(customer.points).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}