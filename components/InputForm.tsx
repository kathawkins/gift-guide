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
      formattedTitle = userInput.toLowerCase();
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
      if (!r_occupation) {
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
          ".";
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
          ".";
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

    createInquiry(inquiryData);

    requestGifts(createGPTPrompt(inquiryData));

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

  async function createInquiry({
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
  }: newInquiry) {
    try {
      if (!user) throw new Error("No user");

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
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    }
  }

  return (
    <form className="form-control text-xs max-w-xl" onSubmit={onFormSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        name="title"
        required
        onChange={onTitleChange}
        value={formFields.title}
      ></input>
      <label>Relationship to Recipient</label>
      <input
        type="text"
        list="relationship"
        name="relationship"
        placeholder="Add an relationship or choose from the dropdown"
        onChange={onRelationshipChange}
        value={formFields.relationship}
        required
      />
      {/* Add more options */}
      <datalist id="relationship">
        <option>Sibling</option>
        <option>Friend</option>
        <option>Parent</option>
        <option>Spouse</option>
        <option>Child</option>
        <option>Colleague</option>
      </datalist>
      <label>Age of Recipient</label>
      <select
        id="age"
        className="select select-bordered text-white"
        name="age"
        onChange={onAgeChange}
        value={formFields.age}
        required
      >
        <option disabled value="">
          Choose from the dropdown
        </option>
        <option>Baby</option>
        <option>Kid</option>
        <option>Teen</option>
        <option>Young Adult</option>
        <option>Adult</option>
        <option>Senior Adult</option>
      </select>
      <label>Recipient&apos;s Occupation</label>
      <input
        type="text"
        list="occupation"
        name="occupation"
        placeholder="Add an occupation or choose from the dropdown (Optional)"
        onChange={onOccupationChange}
        value={formFields.occupation}
      />
      <datalist id="occupation">
        <option>Accountant</option>
        <option>Doctor</option>
        <option>Teacher</option>
      </datalist>
      <label>Recipient&apos;s Interests</label>
      <input
        type="text"
        list="interest1"
        name="interests"
        placeholder="Add an interest or choose from the dropdown"
        onChange={onInterest1Change}
        value={formFields.interest1}
        required
      />
      <datalist id="interest1">
        <option>Sports</option>
        <option>Travel</option>
        <option>Art</option>
      </datalist>
      <input
        type="text"
        list="interest2"
        placeholder="Add an interest or choose from the dropdown (Optional)"
        onChange={onInterest2Change}
        value={formFields.interest2}
        disabled={formFields.interest1 ? false : true}
      />
      <datalist id="interest2">
        <option>Sports</option>
        <option>Travel</option>
        <option>Art</option>
      </datalist>
      <input
        type="text"
        list="interest3"
        placeholder="Add an interest or choose from the dropdown (Optional)"
        onChange={onInterest3Change}
        value={formFields.interest3}
        disabled={formFields.interest2 ? false : true}
      />
      <datalist id="interest3">
        <option>Sports</option>
        <option>Travel</option>
        <option>Art</option>
      </datalist>
      <label htmlFor="hobbies">Recipient&apos;s Hobbies</label>
      <input
        type="text"
        list="hobby1"
        name="hobbies"
        placeholder="Add a hobby or choose from the dropdown"
        onChange={onHobby1Change}
        value={formFields.hobby1}
        required
      />
      <datalist id="hobby1">
        <option>Cooking</option>
        <option>Gardening</option>
        <option>Fishing</option>
      </datalist>
      <input
        type="text"
        list="hobby2"
        placeholder="Add a hobby or choose from the dropdown (Optional)"
        onChange={onHobby2Change}
        value={formFields.hobby2}
        disabled={formFields.hobby1 ? false : true}
      />
      <datalist id="hobby2">
        <option>Cooking</option>
        <option>Gardening</option>
        <option>Fishing</option>
      </datalist>
      <input
        type="text"
        list="hobby3"
        placeholder="Add a hobby or choose from the dropdown (Optional)"
        onChange={onHobby3Change}
        value={formFields.hobby3}
        disabled={formFields.hobby2 ? false : true}
      />
      <datalist id="hobby3">
        <option>Cooking</option>
        <option>Gardening</option>
        <option>Fishing</option>
      </datalist>
      <label htmlFor="occasion">Gift Occasion</label>
      <input
        type="text"
        list="occasion"
        placeholder="Add an occasion or choose from the dropdown"
        onChange={onOccasionChange}
        value={formFields.occasion}
        required
      />
      <datalist id="occasion">
        <option>Birthday</option>
        <option>Anniversary</option>
        <option>Graduation</option>
      </datalist>
      <label>Desired Price Range</label>
      <div className="columns-2 max-w-xs">
        $ Low:{" "}
        <input
          type="number"
          id="priceLow"
          required
          onChange={onPriceLowChange}
          value={formFields.priceLow}
        ></input>
        $ High:{" "}
        <input
          type="number"
          id="priceHigh"
          required
          onChange={onPriceHighChange}
          value={formFields.priceHigh}
          min={formFields.priceLow + 1}
        ></input>
      </div>
      <input type="submit" value="Submit"></input>
    </form>
  );
}
