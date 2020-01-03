
import React from 'react';
import Value from '../../components/value';
import styles from './styles.module.css';
import { Element } from 'react-scroll'

class Values extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Element id='values' name='values'>
      <section className="values" style={{ display: this.props.hidden ? 'none' : 'block'}}>
        <div className="container">
          <div className={styles.title}>
            <h1>Values</h1>
          </div>
          <div className="row">
            <div className="col-md-4 col-6">
              <Value parent={this.myInput} title="Balance" img="values/balance.svg">
                Whether it be diet, beliefs, how much we sleep or the amount we drink, we should strive to not devolve into excess.
                Excess in any aspect of life, whether it's the amount of time we spend scrolling through Facebook or the number of runs we've
                been on in a day, will inevitably lead to either dissatisfaction or burnout. We've evolved as humans to maintain homeostasis. 
                We should embrace this natural balance and extend its influence into all aspects of our lives.
              </Value>
            </div>

            <div className="col-md-4 col-6">
              <Value parent={this.myInput} title="Persistence" img="values/persistence.svg">
                Improvement can only be achieved through practice, and to change ourselves, we have to challenge ourselves.
                If we live in comfort, we stagnate, neither evolving nor developing. I think we should always push to the precipice 
                of our abilities in whatever we do, and in this, push it further into the ocean of possibility.
              </Value>
            </div>

            <div className="col-md-4 col-6">
              <Value title="Presence" img="values/presence.svg">
                Carpe diem, as the saying goes (YOLO the modern equivalent).
                Many of us spend too much time either dwelling on the past, or fretting about the future. In reality, the only thing that exists
                is the present moment. By wasting time like this, we not only miss opportunities, but reduce our capacity to enjoy life.
              </Value>
            </div>

            <div className="col-md-4 col-6">
              <Value title="Humanity" img="values/humanity.svg">
                It's easy to dismiss people we disagree with as "stupid" or "bigoted". I think we should all try to understand where people come
                from before making judgements about who they are. All people are the result of their genes and upbringing, the people they've interacted with
                and their life experiences. Because of this, it's impossible to say whether a person is "right" or "wrong" in how they think.
              </Value>
            </div>

            <div className="col-md-4 col-6">
              <Value title="Skepticism" img="values/skepticism.svg">
                It can be hard to realise, given our trust in modern science, that nothing claimed to be known is truly known.
                Our understanding of the universe has <a href="https://en.wikipedia.org/wiki/Planck_length">many limitations</a>, not least our
                own mental capacity. This should be applied not only to philosophical ideas, but to day-to-day interactions, and when encountering anything 
                that's proclaimed as "true".
              </Value>
            </div>
              
            <div className="col-md-4 col-6">
              <Value title="Realism" img="values/realism.svg">
                The best we can hope for, and what the scientific method aims to do, is to iteratively improve our model of the universe.
                This holds not only for traditionally "scientific" concepts, but also spiritual ones; if "supernatural" phenomena 
                occur, they must be within the fabric of what our universe is capable of, and therefore can be observed and studied like any other.
              </Value>
            </div>

            <div className="col-md-4 col-6">
              <Value title="Explore" img="values/explore.svg">
                We should always be searching for new places, ideas, philosophies and ways of thinking. It is naïve to believe that you 
                have all the answers; every situation you're in, person you meet and concept you encounter can teach you something new.
              </Value>
            </div>

            <div className="col-md-4 col-6">
              <Value title="Create" img="values/create.svg">
                It's liberating to express yourself. Putting our true experience down on (metaphorical) paper allows us to understand ourselves better,
                and to fight our individual demons. Not every piece has to be an exploration into your psyche, but they should all contain
                a small reflection of your soul.
              </Value>
            </div>

            <div className="col-md-4 col-6">
              <Value title="Bond" img="values/bond.svg">
                It's hard to concieve of something more complicated and beautiful than the mind. When multiple minds interact, however, they can
                become more than simply the sum of their parts. Whether it's friendship, professional relationships or romance, the desire to 
                bond and create meaningful connections with likeminded people is a fundamental part of the fabric of society and the individuals
                within it.
              </Value>
            </div>
          </div>
        </div>
      </section>
      </Element>
    );
  }
}

export default Values;