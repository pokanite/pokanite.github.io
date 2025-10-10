import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Plus, Minus, Send, Users, Utensils, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Invite } from "../App";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  isChild: boolean;
  menuPreference: string;
}

interface Submission {
  firstName: string;
  lastName: string;
  phone: string;
  attendance: boolean;
  needsAccommodation: boolean;
  specialMessage: string;

  guests: Guest[];
}

interface Props {
  api_key: string | null;
  invite: Invite;
}

export function RSVPForm({ api_key, invite }: Props) {

  const hasElapsed = Date.now() > invite.answerUntilTimestamp;

  const answerUntil = new Date(invite.answerUntilTimestamp);
  const textAnswerUntilDate = answerUntil.toLocaleDateString('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    attendance: "",
    needsAccommodation: "",
    specialMessage: ""
  });

  const [guests, setGuests] = useState<Guest[]>([
    { id: Date.now().toString(), firstName: "", lastName: "", isChild: false, menuPreference: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formData.attendance === "yes") {
      setGuests(prev =>
        prev.map((g, i) =>
          i === 0
            ? { ...g, firstName: formData.firstName, lastName: formData.lastName }
            : g
        )
      );
    }
  }, [formData.firstName, formData.lastName, formData.attendance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.attendance) {
      toast.error("Моля, попълнете всички задължителни полета");
      return;
    }

    if (formData.attendance === "yes") {
      // Check guests' menuPreference
      for (const guest of guests) {
        if (!guest.menuPreference) {
          toast.error("Моля, изберете предпочитано меню за всеки гост");
          return;
        }
      }

      // Check accommodation
      if (!formData.needsAccommodation) {
        toast.error("Моля, изберете дали имате нужда от настаняване");
        return;
      }
    }

    const submission: Submission = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      attendance: formData.attendance === "yes",
      needsAccommodation: formData.needsAccommodation === "yes",
      specialMessage: formData.specialMessage,
      guests,
    };
    setLoading(true);
    fetch(
      `https://script.google.com/macros/s/${invite.googleScriptRSVP}/exec?key=${api_key}`,
      {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(submission),
      }
    ).then((response) => {
      toast.success("Благодарим за Вашето потвърждение! Очакваме с нетърпение да празнуваме заедно!");
      setSubmitted(true);
    }).catch((err) => {
      console.log("Error submitting RSVP:", err);
      toast.error("Възникна грешка при изпращането. Моля, опитайте отново.");
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGuest = () => {
    const newGuest: Guest = {
      id: Date.now().toString(),
      firstName: "",
      lastName: "",
      isChild: false,
      menuPreference: ""
    };
    setGuests(prev => [...prev, newGuest]);
  };

  const removeGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(prev => prev.filter(guest => guest.id !== id));
    }
  };

  const updateGuest = (id: string, field: keyof Guest, value: string | boolean) => {
    setGuests(prev => prev.map(guest => (guest.id === id ? { ...guest, [field]: value } : guest)));
  };

  return (
    <section id="rsvp" className="py-20 px-6 bg-parchment">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-sage rounded-md flex items-center justify-center">
              <Users size={16} className="text-parchment" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl mb-4 text-olivewood">Форма за потвърждение на присъствие</h2>
          <p className="text-lg text-bark">Моля, отговорете до {textAnswerUntilDate}.</p>
        </div>

        {hasElapsed ? (
          <Card className="p-8 bg-wedding-white border-sand shadow-xl text-center">
            <h3 className="text-2xl text-sage mb-4">Времето за потвърждение изтече</h3>
            <p className="text-bark">
              Моля, свържете се с младоженците, ако все още желаете да потвърдите присъствие.
            </p>
          </Card>
        ) : submitted ? (
          <Card className="p-8 bg-wedding-white border-sand shadow-xl text-center">
            <h3 className="text-2xl text-sage mb-4">Благодарим за Вашето потвърждение!</h3>
            <p className="text-bark">Очакваме с нетърпение да празнуваме заедно!</p>
          </Card>
        ) : (
          <Card className="p-8 bg-wedding-white border-sand shadow-xl rounded-md">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-olivewood">Име *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                    className="mt-2 border-sand focus:border-sage h-12"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-olivewood">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                    className="mt-2 border-sand focus:border-sage h-12"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-olivewood">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className="mt-2 border-sand focus:border-sage h-12"
                  pattern="^[+0-9 ]{8,16}$"
                  required
                  disabled={loading}
                />
              </div>

              {/* Attendance */}
              <div>
                <Label className="text-olivewood mb-4 block">Ще присъствате ли? *</Label>
                <RadioGroup
                  value={formData.attendance}
                  onValueChange={(value) => handleFormChange("attendance", value)}
                  className="flex gap-8"
                  disabled={loading}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="yes" id="yes" className="border-sage text-sage w-5 h-5" />
                    <Label htmlFor="yes" className="text-bark">Да, с удоволствие!</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="no" id="no" className="border-sage text-sage w-5 h-5" />
                    <Label htmlFor="no" className="text-bark">Съжалявам, няма да мога да присъствам</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.attendance === "yes" && (
                <>
                  {/* Guests */}
                  <div className="border-t border-sand/50 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Users size={20} className="text-sage" />
                        <Label className="text-olivewood text-lg">Данни за гости</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={addGuest}
                          size="sm"
                          variant="outline"
                          className="border-sage text-sage hover:bg-sage hover:text-parchment"
                          disabled={loading}
                        >
                          <Plus size={16} />
                        </Button>
                        {guests.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeGuest(guests[guests.length - 1].id)}
                            size="sm"
                            variant="outline"
                            className="border-bark text-bark hover:bg-bark hover:text-parchment"
                            disabled={loading}
                          >
                            <Minus size={16} />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {guests.map((guest, index) => (
                        <Card key={guest.id} className="p-6 bg-sand/20 border-sand/50">
                          <h4 className="text-olivewood mb-4">Гост {index + 1}</h4>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label className="text-olivewood">Име *</Label>
                              <Input
                                value={guest.firstName}
                                onChange={(e) => updateGuest(guest.id, "firstName", e.target.value)}
                                className="mt-1 border-sand focus:border-sage"
                                required={formData.attendance === "yes"}
                                disabled={index === 0 || loading}
                              />
                            </div>
                            <div>
                              <Label className="text-olivewood">Фамилия *</Label>
                              <Input
                                value={guest.lastName}
                                onChange={(e) => updateGuest(guest.id, "lastName", e.target.value)}
                                className="mt-1 border-sand focus:border-sage"
                                required={formData.attendance === "yes"}
                                disabled={index === 0 || loading}
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 mb-4">
                            <Checkbox
                              id={`child-${guest.id}`}
                              checked={guest.isChild}
                              onCheckedChange={(checked) => updateGuest(guest.id, "isChild", checked as boolean)}
                              className="border-sage data-[state=checked]:bg-sage"
                              disabled={loading}
                            />
                            <Label htmlFor={`child-${guest.id}`} className="text-bark">Дете (под 13 години)</Label>
                          </div>

                          <div>
                            <Label className="text-olivewood mb-2 flex items-center gap-2">
                              <Utensils size={16} />
                              Избор на меню
                            </Label>
                            <Select
                              value={guest.menuPreference}
                              onValueChange={(value) => updateGuest(guest.id, "menuPreference", value)}
                              disabled={loading}
                            >
                              <SelectTrigger className="border-sand focus:border-sage bg-white">
                                <SelectValue placeholder="Изберете предпочитано меню *" />
                              </SelectTrigger>
                              <SelectContent className="z-50 bg-white border border-sand shadow-md">
                                <SelectItem value="beef">Телешко филе</SelectItem>
                                <SelectItem value="chicken">Печено пиле с билки</SelectItem>
                                <SelectItem value="salmon">Скара сьомга</SelectItem>
                                <SelectItem value="vegetarian">Вегетарианско меню</SelectItem>
                                <SelectItem value="vegan">Веган меню</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div>
                    <Label className="text-olivewood mb-4 block">Нуждаете ли се от настаняване? *</Label>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <RadioGroup
                        value={formData.needsAccommodation}
                        onValueChange={(value) => handleFormChange("needsAccommodation", value)}
                        className="flex gap-8"
                        disabled={loading}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="yes" className="border-sage text-sage" />
                          <Label className="text-bark">Да, моля</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="no" className="border-sage text-sage" />
                          <Label className="text-bark">Не, благодаря</Label>
                        </div>
                      </RadioGroup>
                      <p className="text-sm text-gray-600 max-w-xs md:text-right">
                        Настаняването е за сметка на гостите.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Special Message */}
              <div>
                <Label htmlFor="specialMessage" className="text-olivewood">Специални съобщения или изисквания</Label>
                <Textarea
                  id="specialMessage"
                  value={formData.specialMessage}
                  onChange={(e) => handleFormChange("specialMessage", e.target.value)}
                  className="mt-2 border-sand focus:border-sage"
                  placeholder="Специални нужди, хранителни ограничения или съобщения за младоженците?"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full bg-sage hover:bg-bark text-parchment h-12" size="lg" disabled={loading}>

                {loading ? (
                  <></>
                ) : (
                  <Send className="mr-2" size={20} />
                )}
                {loading ? "Изпращане..." : "Изпрати потвърждение"}


              </Button>
            </form>
          </Card>
        )}
      </div>
    </section>
  );
}
