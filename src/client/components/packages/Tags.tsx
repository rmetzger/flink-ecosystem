import React from "react";
import { Badge } from "reactstrap";
import { categories } from "client/helpers/categories";
import { Link } from "@reach/router";

const categoryValues = categories.map(c => c.value);

export default function Tags(props: TagsProps) {
  const { category } = props;
  return (
    <>
      <hr />
      <div className="row align-items-baseline">
        <div className="col">
          <span>Tags: </span>
          <big>
            <Link to={`/categories/${category}`} className="mr-2">
              <Badge color="secondary">{category}</Badge>
            </Link>
            {props.tags
              .split(",")
              .map(tag => tag.trim())
              .filter(
                tag => tag.toLocaleLowerCase() !== category.toLocaleLowerCase()
              )
              .map((tag, i) => {
                const uriTag = encodeURIComponent(tag);
                const linkBase = categoryValues.includes(tag)
                  ? "categories"
                  : "search";
                return (
                  <Link to={`/${linkBase}/${uriTag}`} key={i} className="mr-2">
                    <Badge color="secondary">{tag}</Badge>
                  </Link>
                );
              })}
          </big>
        </div>
      </div>
    </>
  );
}

type TagsProps = {
  tags: string;
  category: string;
};
