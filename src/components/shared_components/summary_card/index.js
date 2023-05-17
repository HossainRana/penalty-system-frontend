import { Divider, Grid, Typography } from "@material-ui/core";
import React from "react";
import { Card, IconBox, useStyles, NumberHeader } from "./style";
import { Link } from "react-router-dom";

export default function SummaryCard(props) {
  const classes = useStyles();
  const {
    color,
    title,
    value,
    url,
    icon,
    h2,
    name,
    tollCardStyles,
    widthLength,
    totalCardStyle,
    show,
  } = props;

  return (
    <Grid
      className={name ? tollCardStyles.root : classes.root}
      item
      md={widthLength ? +widthLength : 3}
      sm={12}
      xs={12}
    >
      <Card
        variant="outlined"
        className={totalCardStyle?totalCardStyle.card: classes.card}
        style={{ backgroundColor: color }}
      >
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={12}>
            {show === "false" ? (
              <></>
            ) : (
              <>
                <IconBox>
                  <div className={classes.icons}>
                    {icon === "false" ? "" : icon}
                  </div>
                </IconBox>
              </>
            )}
          </Grid>

          <Grid item xs={12} className={totalCardStyle && totalCardStyle.totalCenter}>
            <NumberHeader variant="h4">{value}</NumberHeader>
          </Grid>
          <Grid item xs={12}>
            <Typography  variant="h6" className={totalCardStyle? totalCardStyle.totalFont: classes.title}>
              {title}
            </Typography>
          </Grid>
        </Grid>
          
        
        

        {show === "false" ? (
          <></>
        ) : (
          <>
            <Divider className={classes.divider} />
            <Link to={url} className={classes.link}>
              daha fazla göster
            </Link>
          </>
        )}
      </Card>
    </Grid>
  );
}
