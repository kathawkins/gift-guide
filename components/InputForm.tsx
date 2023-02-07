import React, { useState } from "react";
import { Database } from "../types/supabase";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
type newInquiry = {
  title: string;
  r_relationship: string;
  r_age: string;
  r_occupation: string;
  r_interests: string;
  r_hobbies: string;
  g_occasion: string;
  g_price_low: number;
  g_price_high: number;
  profile_id: string;
};

export default function InputForm({
  newInquiryCreated,
  requestGifts,
}: {
  newInquiryCreated: CallableFunction;
  requestGifts: CallableFunction;
}) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [showForm, setShowForm] = useState(true);
  const [formFields, setformFields] = useState({
    title: "",
    relationship: "",
    age: "",
    occupation: "",
    interest1: "",
    interest2: "",
    interest3: "",
    hobby1: "",
    hobby2: "",
    hobby3: "",
    occasion: "",
    priceLow: 0,
    priceHigh: 100,
  });

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, title: event.target.value });
  };
  const onRelationshipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, relationship: event.target.value });
  };
  const onAgeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setformFields({ ...formFields, age: event.target.value });
  };
  const onOccupationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, occupation: event.target.value });
  };
  const onInterest1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, interest1: event.target.value });
  };
  const onInterest2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, interest2: event.target.value });
  };
  const onInterest3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, interest3: event.target.value });
  };
  const onHobby1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, hobby1: event.target.value });
  };
  const onHobby2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, hobby2: event.target.value });
  };
  const onHobby3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, hobby3: event.target.value });
  };
  const onOccasionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, occasion: event.target.value });
  };
  const onPriceLowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, priceLow: parseInt(event.target.value) });
  };
  const onPriceHighChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setformFields({ ...formFields, priceHigh: parseInt(event.target.value) });
  };

  const formatInterests = (
    interest1: string,
    interest2: string,
    interest3: string
  ): string => {
    let interests = "";
    if (interest1 && interest2 && interest3) {
      interests = interest1.concat(", ", interest2, ", and ", interest3);
    } else if (interest1 && interest2) {
      interests = interest1.concat(" and ", interest2);
    } else if (interest1) {
      interests = interest1;
    }
    return interests;
  };

  const formatHobbies = (
    hobby1: string,
    hobby2: string,
    hobby3: string
  ): string => {
    let hobbies = "";
    if (hobby1 && hobby2 && hobby3) {
      hobbies = hobby1.concat(", ", hobby2, ", and ", hobby3);
    } else if (hobby1 && hobby2) {
      hobbies = hobby1.concat(" and ", hobby2);
    } else if (hobby1) {
      hobbies = hobby1;
    }
    return hobbies;
  };

  const formatTitle = (userInput: string): string => {
    let formattedTitle = "";
    const numInputWords = userInput.split(" ").length;
    if (numInputWords > 1) {
      formattedTitle = userInput
        .toLowerCase()
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    } else {
      formattedTitle = userInput.charAt(0).toUpperCase() + userInput.slice(1);
    }
    return formattedTitle;
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      console.error("No user found when submitting");
      return;
    }

    const createGPTPrompt = ({
      title,
      r_relationship,
      r_age,
      r_occupation,
      r_interests,
      r_hobbies,
      g_occasion,
      g_price_low,
      g_price_high,
      profile_id,
    }: newInquiry) => {
      let finalPrompt = "";
      if (!r_occupation || r_occupation === "none") {
        finalPrompt.concat("");
        finalPrompt =
          "Provide a list of 10 " +
          g_occasion +
          " gift ideas within the $" +
          g_price_low +
          "-" +
          g_price_high +
          " price range for my " +
          r_age +
          " " +
          r_relationship +
          ". Their interests include " +
          r_interests +
          " and their hobbies are " +
          r_hobbies +
          ". The list should formatted numerically like: '1. suggestion A...\n2. suggestion B...\n 3. suggestion C....' and so forth. Do not include price ranges in the list.";
      } else {
        finalPrompt =
          "Provide a list of 10 " +
          g_occasion +
          " gift ideas within the $" +
          g_price_low +
          "-" +
          g_price_high +
          " price range for my " +
          r_age +
          " " +
          r_relationship +
          ". They are a(n) " +
          r_occupation +
          " who's interests include " +
          r_interests +
          " and their hobbies are " +
          r_hobbies +
          ". The list should formatted numerically like: '1. suggestion A\n2. suggestion B\n 3. suggestion C' and so forth. Do not include price ranges in the list.";
      }
      return finalPrompt;
    };

    // add error handling (empty string) for all fields?
    const inquiryData = {
      title: formatTitle(formFields.title),
      r_relationship: formFields.relationship.toLowerCase(),
      r_age: formFields.age.toLowerCase(),
      r_occupation: formFields.occupation.toLowerCase(),
      r_interests: formatInterests(
        formFields.interest1,
        formFields.interest2,
        formFields.interest3
      ).toLowerCase(),
      r_hobbies: formatHobbies(
        formFields.hobby1,
        formFields.hobby2,
        formFields.hobby3
      ).toLowerCase(),
      g_occasion: formFields.occasion.toLowerCase(),
      g_price_low: formFields.priceLow,
      g_price_high: formFields.priceHigh,
      profile_id: user.id,
    };

    const giftRequestPrompt = createGPTPrompt(inquiryData);
    saveInquiry(inquiryData, giftRequestPrompt);

    setformFields({
      title: "",
      relationship: "",
      age: "",
      occupation: "",
      interest1: "",
      interest2: "",
      interest3: "",
      hobby1: "",
      hobby2: "",
      hobby3: "",
      occasion: "",
      priceLow: 0,
      priceHigh: 100,
    });
  };

  async function saveInquiry(
    {
      title,
      r_relationship,
      r_age,
      r_occupation,
      r_interests,
      r_hobbies,
      g_occasion,
      g_price_low,
      g_price_high,
      profile_id,
    }: newInquiry,
    prompt: string
  ) {
    try {
      let { data, error } = await supabase
        .from("inquiries")
        .insert({
          title,
          r_relationship,
          r_age,
          r_occupation,
          r_interests,
          r_hobbies,
          g_occasion,
          g_price_low,
          g_price_high,
          profile_id,
        })
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        newInquiryCreated(data[0]);
        requestGifts(prompt, data[0].id);
      }

      setShowForm(false);
    } catch (error) {
      alert("Error saving gift guide to profile!");
      console.log(error);
    }
  }

  return (
    <div>
      {showForm && (
        <form
          className="form-control max-w-2xl mx-auto px-5 justify-self-center mt-5"
          onSubmit={onFormSubmit}
        >
          <label className="text-lg font-bold mt-2">
            Relationship to Recipient
          </label>
          <input
            type="text"
            list="relationship"
            name="relationship"
            placeholder="Choose from our list or add your own"
            onChange={onRelationshipChange}
            value={formFields.relationship}
            required
            className="input input-primary input-bordered w-full"
          />
          <datalist id="relationship">
            <option>Sibling</option>
            <option>Friend</option>
            <option>Parent</option>
            <option>Spouse</option>
            <option>Child</option>
            <option>Colleague</option>
          </datalist>
          <label className="text-lg font-bold mt-2">Age of Recipient</label>
          <select
            id="age"
            name="age"
            onChange={onAgeChange}
            value={formFields.age}
            required
            className="input input-primary input-bordered w-full "
            placeholder="choose"
          >
            <option disabled value="" className="text-[#9DA3AE]">
              Choose from our list
            </option>
            {/* <option>Baby</option> */}
            <option>Kid</option>
            <option>Teen</option>
            <option>Young Adult</option>
            <option>Adult</option>
            <option>Senior Adult</option>
          </select>
          <label className="text-lg font-bold mt-2">
            Recipient&apos;s Occupation
          </label>
          <input
            type="text"
            list="occupation"
            name="occupation"
            placeholder="Choose from our list or add your own (Optional)"
            onChange={onOccupationChange}
            value={formFields.occupation}
            className="input input-primary input-bordered w-full"
          />
          <datalist id="occupation">
            <option>None</option>
            <option>Student</option>
            <option>Retired ...</option>
            <option>Chef</option>
            <option>Accountant</option>
            <option>Doctor</option>
            <option>Teacher</option>
            <option>Entrepreneur</option>
            <option>Software Developer</option>
            <option>Realtor</option>
            <option>Firefighter</option>
            <option>Artist</option>
            <option>Nurse</option>
            <option>Architect</option>
            <option>Consultant</option>
            <option>Writer</option>
          </datalist>
          <label className="text-lg font-bold mt-2">
            Recipient&apos;s Interests
          </label>
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-2">
              <input
                type="text"
                list="interest1"
                name="interests"
                placeholder="Choose from our list or add your own"
                onChange={onInterest1Change}
                value={formFields.interest1}
                required
                className="input input-primary input-bordered w-full"
              />
              <datalist id="interest1">
                <option>Sports</option>
                <option>Travel</option>
                <option>Art</option>
                <option>Beer</option>
                <option>Pets</option>
                <option>Home Decor</option>
                <option>Jewelry</option>
                <option>Food</option>
                <option>Fashion</option>
                <option>Coffee</option>
                <option>Games</option>
                <option>Whiskey</option>
                <option>Tech</option>
                <option>Self-care</option>
                <option>Movies</option>
                <option>Video Games</option>
                <option>Wine</option>
                <option>TV</option>
                <option>Music</option>
                <option>Yoga</option>
              </datalist>
            </div>
            <div>
              <input
                type="text"
                list="interest2"
                placeholder="(Optional)"
                onChange={onInterest2Change}
                value={formFields.interest2}
                disabled={formFields.interest1 ? false : true}
                className="input input-primary input-bordered w-full"
              />
              <datalist id="interest2">
                <option>Sports</option>
                <option>Travel</option>
                <option>Art</option>
                <option>Beer</option>
                <option>Pets</option>
                <option>Home Decor</option>
                <option>Jewelry</option>
                <option>Food</option>
                <option>Fashion</option>
                <option>Coffee</option>
                <option>Games</option>
                <option>Whiskey</option>
                <option>Tech</option>
                <option>Self-care</option>
                <option>Movies</option>
                <option>Wine</option>
                <option>Video Games</option>
                <option>Wine</option>
                <option>TV</option>
                <option>Music</option>
                <option>Yoga</option>
              </datalist>
            </div>
            <div>
              <input
                type="text"
                list="interest3"
                placeholder="(Optional)"
                onChange={onInterest3Change}
                value={formFields.interest3}
                disabled={formFields.interest2 ? false : true}
                className="input input-primary input-bordered w-full"
              />
              <datalist id="interest3">
                <option>Sports</option>
                <option>Travel</option>
                <option>Art</option>
                <option>Beer</option>
                <option>Pets</option>
                <option>Home Decor</option>
                <option>Jewelry</option>
                <option>Food</option>
                <option>Fashion</option>
                <option>Coffee</option>
                <option>Games</option>
                <option>Whiskey</option>
                <option>Tech</option>
                <option>Self-care</option>
                <option>Movies</option>
                <option>Wine</option>
                <option>Video Games</option>
                <option>Wine</option>
                <option>TV</option>
                <option>Music</option>
                <option>Yoga</option>
              </datalist>
            </div>
          </div>
          <label className="text-lg font-bold mt-2" htmlFor="hobbies">
            Recipient&apos;s Hobbies
          </label>
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-2">
              <input
                type="text"
                list="hobby1"
                name="hobbies"
                placeholder="Choose from our list or add your own"
                onChange={onHobby1Change}
                value={formFields.hobby1}
                required
                className="input input-primary input-bordered w-full"
              />
              <datalist id="hobby1">
                <option>Cooking</option>
                <option>Gardening</option>
                <option>Fishing</option>
                <option>Hiking</option>
                <option>Gaming</option>
                <option>Camping</option>
                <option>Volunteering</option>
                <option>Cycling</option>
                <option>Farming</option>
                <option>Rock Climbing</option>
                <option>Traveling</option>
                <option>Performing Arts</option>
                <option>Reading</option>
                <option>Photography</option>
                <option>Writing</option>
                <option>Running</option>
                <option>Drawing</option>
                <option>Knitting</option>
                <option>Painting</option>
                <option>Weightlifting</option>
                <option>Crafting</option>
              </datalist>
            </div>
            <div>
              <input
                type="text"
                list="hobby2"
                placeholder="(Optional)"
                onChange={onHobby2Change}
                value={formFields.hobby2}
                disabled={formFields.hobby1 ? false : true}
                className="input input-primary input-bordered w-full"
              />
              <datalist id="hobby2">
                <option>Cooking</option>
                <option>Gardening</option>
                <option>Fishing</option>
                <option>Hiking</option>
                <option>Gaming</option>
                <option>Camping</option>
                <option>Volunteering</option>
                <option>Cycling</option>
                <option>Farming</option>
                <option>Rock Climbing</option>
                <option>Traveling</option>
                <option>Performing Arts</option>
                <option>Reading</option>
                <option>Photography</option>
                <option>Writing</option>
                <option>Running</option>
                <option>Drawing</option>
                <option>Knitting</option>
                <option>Painting</option>
                <option>Weightlifting</option>
                <option>Crafting</option>
              </datalist>
            </div>
            <div>
              <input
                type="text"
                list="hobby3"
                placeholder="(Optional)"
                onChange={onHobby3Change}
                value={formFields.hobby3}
                disabled={formFields.hobby2 ? false : true}
                className="input input-primary input-bordered w-full"
              />
              <datalist id="hobby3">
                <option>Cooking</option>
                <option>Gardening</option>
                <option>Fishing</option>
                <option>Hiking</option>
                <option>Gaming</option>
                <option>Camping</option>
                <option>Volunteering</option>
                <option>Cycling</option>
                <option>Farming</option>
                <option>Rock Climbing</option>
                <option>Traveling</option>
                <option>Performing Arts</option>
                <option>Reading</option>
                <option>Photography</option>
                <option>Writing</option>
                <option>Running</option>
                <option>Drawing</option>
                <option>Knitting</option>
                <option>Painting</option>
                <option>Weightlifting</option>
                <option>Crafting</option>
              </datalist>
            </div>
          </div>
          <label className="text-lg font-bold mt-2" htmlFor="occasion">
            Gift Occasion
          </label>
          <input
            type="text"
            list="occasion"
            placeholder="Choose from our list or add your own"
            onChange={onOccasionChange}
            value={formFields.occasion}
            required
            className="input input-primary input-bordered w-full"
          />
          <datalist id="occasion">
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Graduation</option>
            <option>Wedding</option>
            <option>Holiday</option>
            <option>&quot;Just Because&quot;</option>
          </datalist>
          <label className="text-lg font-bold mt-2">Desired Price Range</label>
          <div className="columns-2 max-w-xs">
            $ Low:
            <input
              type="number"
              id="priceLow"
              required
              onChange={onPriceLowChange}
              value={formFields.priceLow}
              className="input input-primary input-bordered w-full"
              placeholder="0"
            ></input>
            $ High:
            <input
              type="number"
              id="priceHigh"
              required
              onChange={onPriceHighChange}
              value={formFields.priceHigh}
              min={formFields.priceLow + 1}
              className="input input-primary input-bordered w-full"
              placeholder="100"
            ></input>
          </div>
          <label htmlFor="title" className="text-lg font-bold mt-2">
            Gift Guide Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={onTitleChange}
            value={formFields.title}
            maxLength={50}
            placeholder='(e.g. "Gift for Mom&apos;s 50th")'
            className="input input-primary input-bordered w-full"
          ></input>
          <input
            type="submit"
            value="Submit"
            className="btn my-5 btn-secondary"
          ></input>
        </form>
      )}
    </div>
  );
}
