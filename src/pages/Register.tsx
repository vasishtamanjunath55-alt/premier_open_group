import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import bsgLogo from "@/assets/bsg-logo.png";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  registrationNumber: z.string().optional(),
  section: z.string().min(1, "Section is required"),
  name: z.string().min(1, "Name is required").max(100),
  fatherName: z.string().min(1, "Father's name is required").max(100),
  motherName: z.string().min(1, "Mother's name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  mobileNo: z.string().min(10, "Valid mobile number is required").max(15),
  email: z.string().email("Valid email is required"),
  communicationAddress: z.string().min(1, "Communication address is required"),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  alternateContact: z.string().optional(),
  schoolCollege: z.string().optional(),
  photo: z.any().optional(),
});

export default function Register() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrationNumber: "",
      section: "",
      name: "",
      fatherName: "",
      motherName: "",
      dateOfBirth: "",
      bloodGroup: "",
      mobileNo: "",
      email: "",
      communicationAddress: "",
      permanentAddress: "",
      alternateContact: "",
      schoolCollege: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('member_registrations').insert({
        registration_number: values.registrationNumber || null,
        section: values.section,
        name: values.name,
        father_name: values.fatherName,
        mother_name: values.motherName,
        date_of_birth: values.dateOfBirth,
        blood_group: values.bloodGroup,
        mobile_no: values.mobileNo,
        email: values.email,
        communication_address: values.communicationAddress,
        permanent_address: values.permanentAddress,
        alternate_contact: values.alternateContact || null,
        school_college: values.schoolCollege || null,
      });

      if (error) throw error;

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted successfully. We will contact you soon.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="bg-white border-4 border-black p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <img src={bsgLogo} alt="BSG Logo" className="w-20 h-20 object-contain" />
              <div className="flex-1 text-center px-4">
                <h1 className="text-xl font-bold mb-1">THE BHARAT SCOUTS AND GUIDES KARNATAKA</h1>
                <h2 className="text-2xl font-bold">PREMIER OPEN GROUP</h2>
                <p className="text-sm mt-2">Sri Jayachamarajendra Scouts and Guides Headquarters, Mysuru - 570005</p>
                <p className="text-sm">ESTD: 1987-88</p>
                <p className="text-sm">Email: premieropengroup@gmail.com</p>
              </div>
              <img src={logo} alt="Premier Open Group Logo" className="w-20 h-20 rounded-full" />
            </div>
            
            <div className="border-t-4 border-black pt-4">
              <h3 className="text-xl font-bold text-center mb-2">GROUP IDENTITY CARD REGISTRATION FORMAT</h3>
              <p className="text-center font-semibold">BUNNY/CUB/BULBUL/SCOUT/GUIDE/ROVER/RANGER/UNIT LEADER</p>
            </div>
            
            {/* Download Option */}
            <div className="flex justify-center mt-4 pt-4 border-t-2 border-gray-200">
              <a 
                href="/POG_ID_Card_Registration_Format.pdf" 
                download
              >
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Offline Form (PDF)
                </Button>
              </a>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">Fill the form online below or download the PDF to fill offline</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section A */}
              <div className="bg-white border-2 border-gray-300 p-6">
                <h3 className="text-lg font-bold mb-4 bg-gray-100 p-2">Section-A</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bunny">Bunny</SelectItem>
                            <SelectItem value="cub">Cub</SelectItem>
                            <SelectItem value="bulbul">Bulbul</SelectItem>
                            <SelectItem value="scout">Scout</SelectItem>
                            <SelectItem value="guide">Guide</SelectItem>
                            <SelectItem value="rover">Rover</SelectItem>
                            <SelectItem value="ranger">Ranger</SelectItem>
                            <SelectItem value="unit-leader">Unit Leader</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section B */}
              <div className="bg-white border-2 border-gray-300 p-6">
                <h3 className="text-lg font-bold mb-4 bg-gray-100 p-2">Section-B</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name (Capital Letter) *</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name (Capital Letter) *</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name (Capital Letter) *</FormLabel>
                        <FormControl>
                          <Input {...field} className="uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mobileNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile No. *</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email.id *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="communicationAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Address *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permanent Address *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alternateContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternative Contact Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schoolCollege"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School/College Name (If applicable)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Office Use */}
              <div className="bg-gray-50 border-2 border-gray-300 p-6">
                <h3 className="text-lg font-bold text-center mb-2">FOR OFFICE USE</h3>
                <p className="text-center text-sm">
                  Received Rupees Two Hundred Only (Rs.200/-) towards Unit Registration Fees from
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
